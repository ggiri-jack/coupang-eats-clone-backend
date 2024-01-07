import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: String,
  email: String,
  emailVerified: Date,
  image: String,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

export const User = model('User', userSchema)
