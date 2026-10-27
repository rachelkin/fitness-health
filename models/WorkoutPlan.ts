import { Schema, model, models } from 'mongoose'

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  sets: String,
  reps: String,
  duration: String,
  notes: String,
})

const DaySchema = new Schema({
  dayNumber: Number,
  dayName: String,
  exercises: [ExerciseSchema],
})

const WorkoutPlanSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  duration: { type: String, required: true },
  level: { type: String, enum: ['מתחיל', 'בינוני', 'מתקדם'], required: true },
  days: [DaySchema],
  color: { type: String, default: '#8B7355' },
  icon: { type: String, default: '💪' },
}, { timestamps: true })

export const WorkoutPlan = models.WorkoutPlan || model('WorkoutPlan', WorkoutPlanSchema)
