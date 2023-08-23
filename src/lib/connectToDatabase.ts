import mongoose from 'mongoose'

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL)

    console.log('Connected to Database')
  } catch (err) {
    console.log({ dbError: err })
    throw new Error('Error connecting to database')
  }
}

export default connectToDatabase
