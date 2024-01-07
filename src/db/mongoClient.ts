import mongoose, { set } from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"')
}

export const connectToDB = async () => {
  await mongoose.connect(
    process.env.MONGO_URI ?? 'mongodb://dabinkimjae:1234@127.0.0.1:27017/test' 
  )

  console.log(`Connected to database at ${process.env.MONGO_URI}`)
}

// if (process.env.TS_NODE_DEV) set('debug', true)
