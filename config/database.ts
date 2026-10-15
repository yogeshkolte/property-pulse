import mongoose from 'mongoose'

// Reuse one connection across hot reloads in development and across requests
// in production, instead of opening a new one every time connectDB is called
const globalForMongoose = globalThis as unknown as {
  mongooseConnection?: Promise<typeof mongoose>
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env')
  }

  mongoose.set('strictQuery', true)

  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose
      .connect(uri)
      .catch((error) => {
        // Allow the next call to retry instead of reusing a failed connection
        globalForMongoose.mongooseConnection = undefined
        throw error
      })
  }

  return globalForMongoose.mongooseConnection
}

export default connectDB
