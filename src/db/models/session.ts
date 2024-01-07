import { Schema, Types, model } from 'mongoose'

const sessionSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  expires: { type: Date, required: true },
  sessionToken: { type: String, required: true },
  accessToken: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

export const Session = model('Session', sessionSchema)
