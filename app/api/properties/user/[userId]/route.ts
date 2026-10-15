import { isValidObjectId } from 'mongoose'
import connectDB from '@/config/database'
import Property from '@/models/Property'

// GET /api/properties/user/:userId
// The properties a user has listed, newest first
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  try {
    const { userId } = await params

    // Ids that can't be MongoDB ids can't own any properties
    if (!isValidObjectId(userId)) {
      return Response.json([])
    }

    await connectDB()

    const properties = await Property.find({ owner: userId })
      .sort({ createdAt: -1 })
      .lean()

    return Response.json(properties)
  } catch (error) {
    console.error('Failed to fetch user properties:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
