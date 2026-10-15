import { isValidObjectId } from 'mongoose'
import connectDB from '@/config/database'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

type Context = { params: Promise<{ id: string }> }

// Find a message the signed-in user received, or the error response to send
const findOwnMessage = async (id: string) => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return {
      error: Response.json(
        { message: 'You must be signed in' },
        { status: 401 },
      ),
    }
  }

  if (!isValidObjectId(id)) {
    return {
      error: Response.json({ message: 'Message not found' }, { status: 404 }),
    }
  }

  await connectDB()

  const message = await Message.findById(id)
  // Other people's messages are reported as missing, not forbidden
  if (!message || message.recipient.toString() !== sessionUser.userId) {
    return {
      error: Response.json({ message: 'Message not found' }, { status: 404 }),
    }
  }

  return { message }
}

// PATCH /api/messages/:id
// Mark a message as read or unread: body { read: boolean }
export const PATCH = async (request: Request, { params }: Context) => {
  try {
    const { id } = await params
    const { message, error } = await findOwnMessage(id)
    if (error) {
      return error
    }

    const { read } = await request.json()
    if (typeof read !== 'boolean') {
      return Response.json(
        { message: 'read must be true or false' },
        { status: 400 },
      )
    }

    message.read = read
    await message.save()

    return Response.json({ read: message.read })
  } catch (error) {
    console.error('Failed to update message:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// DELETE /api/messages/:id
export const DELETE = async (_request: Request, { params }: Context) => {
  try {
    const { id } = await params
    const { message, error } = await findOwnMessage(id)
    if (error) {
      return error
    }

    await message.deleteOne()

    return Response.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Failed to delete message:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
