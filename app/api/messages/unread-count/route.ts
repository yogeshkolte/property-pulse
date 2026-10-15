import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

// GET /api/messages/unread-count
// How many unread messages the signed-in user has (0 when signed out)
export const GET = async () => {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return Response.json({ count: 0 })
    }

    await connectDB()
    const count = await Message.countDocuments({
      recipient: sessionUser.userId,
      read: false,
    })

    return Response.json({ count })
  } catch (error) {
    console.error('Failed to count unread messages:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
