const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatHistories = {};

function getTripsContext() {
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
  return JSON.stringify(db.trips, null, 2);
}

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'calculate_trip_price',
      description: 'Calculates total trip price for a group with optional discount',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          price_per_person: { type: 'number', description: 'Price per person in USD' },
          num_people: { type: 'integer', description: 'Number of travelers' },
          discount_percent: { type: 'number', description: 'Discount percentage (0-100)' }
        },
        additionalProperties: false,
        required: ['price_per_person', 'num_people', 'discount_percent']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate_trip_duration',
      description: 'Calculates number of days between start and end date',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          start_date: { type: 'string', description: 'Start date YYYY-MM-DD' },
          end_date: { type: 'string', description: 'End date YYYY-MM-DD' }
        },
        additionalProperties: false,
        required: ['start_date', 'end_date']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_current_date',
      description: 'Returns today\'s date',
      strict: true,
      parameters: { type: 'object', properties: {}, additionalProperties: false, required: [] }
    }
  }
];

function runTool(name, args) {
  if (name === 'calculate_trip_price') {
    const total = args.price_per_person * args.num_people * (1 - args.discount_percent / 100);
    return `Total price for ${args.num_people} people: $${total.toLocaleString()} (discount: ${args.discount_percent}%)`;
  }
  if (name === 'calculate_trip_duration') {
    const days = Math.round((new Date(args.end_date) - new Date(args.start_date)) / (1000 * 60 * 60 * 24));
    return `Trip duration: ${days} days (${args.start_date} → ${args.end_date})`;
  }
  if (name === 'get_current_date') {
    return new Date().toISOString().split('T')[0];
  }
}

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(middlewares);

server.use(require('express').json());

server.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const sid = sessionId || 'default';
  if (!chatHistories[sid]) {
    chatHistories[sid] = [{
      role: 'system',
      content: `You are a friendly and enthusiastic travel agent for a booking website. 
Answer warmly and helpfully. Use tools when asked about prices, dates, or durations.
Here are all available trips:\n${getTripsContext()}`
    }];
  }

  chatHistories[sid].push({ role: 'user', content: message });

  try {
    let messages = chatHistories[sid];
    while (true) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages,
        tools: TOOLS,
        max_tokens: 80,
        temperature: 1.5,
        
      });
      const msg = response.choices[0].message;
      if (msg.tool_calls) {
        messages.push(msg);
        for (const tc of msg.tool_calls) {
          const result = runTool(tc.function.name, JSON.parse(tc.function.arguments));
          messages.push({ role: 'tool', tool_call_id: tc.id, name: tc.function.name, content: result });
        }
      } else {
        chatHistories[sid].push({ role: 'assistant', content: msg.content });
        return res.json({ reply: msg.content });
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: 'Sorry, something went wrong', error: e.message });
  }
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
