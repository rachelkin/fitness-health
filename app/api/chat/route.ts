import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

let pdfContext: string | null = null

async function getPdfContext(): Promise<string> {
  if (pdfContext !== null) return pdfContext

  try {
    const pdfParse = require('pdf-parse')
    const pdfPath = path.join(process.cwd(), 'Personal training programs.pdf')
    
    if (!fs.existsSync(pdfPath)) {
      pdfContext = ''
      return pdfContext
    }

    const buffer = fs.readFileSync(pdfPath)
    const data = await pdfParse(buffer)
    pdfContext = data.text.slice(0, 6000)
  } catch (error) {
    console.error('Error loading PDF context:', error)
    pdfContext = ''
  }

  return pdfContext
}

const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'calculate_bmi',
      description: 'מחשב BMI לפי גובה ומשקל',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          weight_kg: { type: 'number', description: 'משקל בק"ג' },
          height_cm: { type: 'number', description: 'גובה בס"מ' },
        },
        additionalProperties: false,
        required: ['weight_kg', 'height_cm'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculate_calories',
      description: 'מחשב צריכת קלוריות יומית מומלצת לפי נתונים אישיים',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          weight_kg: { type: 'number', description: 'משקל בק"ג' },
          height_cm: { type: 'number', description: 'גובה בס"מ' },
          age: { type: 'number', description: 'גיל' },
          gender: { type: 'string', description: 'מין: male או female' },
          activity: { type: 'string', description: 'רמת פעילות: low, medium, high' },
        },
        additionalProperties: false,
        required: ['weight_kg', 'height_cm', 'age', 'gender', 'activity'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_current_date',
      description: 'מחזיר את התאריך הנוכחי',
      strict: true,
      parameters: { type: 'object', properties: {}, additionalProperties: false, required: [] },
    },
  },
]

function runTool(name: string, args: Record<string, any>): string {
  if (name === 'calculate_bmi') {
    const bmi = args.weight_kg / Math.pow(args.height_cm / 100, 2)
    const rounded = bmi.toFixed(1)
    let category = ''
    if (bmi < 18.5) category = 'תת משקל'
    else if (bmi < 25) category = 'משקל תקין'
    else if (bmi < 30) category = 'עודף משקל'
    else category = 'השמנה'
    return `BMI: ${rounded} — ${category}`
  }
  if (name === 'calculate_calories') {
    let bmr = args.gender === 'female'
      ? 10 * args.weight_kg + 6.25 * args.height_cm - 5 * args.age - 161
      : 10 * args.weight_kg + 6.25 * args.height_cm - 5 * args.age + 5
    const multiplier = args.activity === 'high' ? 1.725 : args.activity === 'medium' ? 1.55 : 1.375
    return `צריכת קלוריות יומית מומלצת: ${Math.round(bmr * multiplier)} קלוריות`
  }
  if (name === 'get_current_date') {
    return new Date().toLocaleDateString('he-IL')
  }
  return ''
}

const chatHistories: Record<string, OpenAI.Chat.ChatCompletionMessageParam[]> = {}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }

    const sid = sessionId || 'default'
    const context = await getPdfContext()

    if (!chatHistories[sid]) {
      chatHistories[sid] = [
        {
          role: 'system',
          content: `את עוזרת אישית של אתר FitnessHealth — אתר לאימון אישי ותזונה בריאה.
ענה אך ורק על שאלות הקשורות לכושר, תזונה, אימונים, בריאות ואתר זה.
אם שואלים על נושא שאינו קשור — ענה בדיוק כך: "🏋️ אני כאן רק לעזור בנושאי כושר ותזונה! לשאלות אחרות אני לא יכולה לעזור 😊"
אם יש בעיה טכנית או בעיית התחברות לאתר — ענה בדיוק כך: "⚙️ נתקלת בבעיה טכנית? נסי לרענן את הדף או לצאת ולהיכנס מחדש. אם הבעיה נמשכת — צרי קשר דרך הטופס בתחתית הדף 📩"
דברי בעברית, בצורה חמה, מעודדת ומקצועית.
השתמשי בכלים לחישוב BMI וקלוריות כשנדרש.
הגבלת אורך תשובה: קצרה וממוקדת.

מידע מקצועי מהמאמנת:
${context}`,
        },
      ]
    }

    chatHistories[sid].push({ role: 'user', content: message })

    // שמור היסטוריה מוגבלת — מקסימום 10 הודעות אחרונות + system
    if (chatHistories[sid].length > 12) {
      chatHistories[sid] = [chatHistories[sid][0], ...chatHistories[sid].slice(-10)]
    }

    let messages = chatHistories[sid]

    while (true) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools: TOOLS,
        max_tokens: 300,
        temperature: 0.7,
      })

      const msg = response.choices[0].message

      if (msg.tool_calls) {
        messages.push({
          role: 'assistant',
          content: msg.content || null,
          tool_calls: msg.tool_calls,
        })

        for (const tc of msg.tool_calls) {
          if (tc.type === 'function') {
            let parsedArgs = {}
            try {
              parsedArgs = JSON.parse(tc.function.arguments)
            } catch (err) {
              parsedArgs = {}
            }

            const result = runTool(tc.function.name, parsedArgs)
            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: typeof result === 'string' ? result : JSON.stringify(result),
            })
          }
        }
      } else {
        const replyContent = msg.content || ''
        chatHistories[sid].push({ role: 'assistant', content: replyContent })
        return NextResponse.json({ reply: replyContent })
      }
    }
  } catch (e: any) {
    console.error('API Error:', e)
    return NextResponse.json({ reply: 'מצטערת, משהו השתבש. נסי שוב.' }, { status: 500 })
  }
}