import { Schema, model, models } from 'mongoose'

const ExerciseProgressSchema = new Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

const DailyProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan' },
  exercises: [ExerciseProgressSchema],
  notes: { type: String, default: '' },
}, { timestamps: true })

DailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true })

export const DailyProgress = models.DailyProgress || model('DailyProgress', DailyProgressSchema)
