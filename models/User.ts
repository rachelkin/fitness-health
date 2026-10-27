import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
}, { timestamps: true })

export const User = models.User || model('User', UserSchema)
