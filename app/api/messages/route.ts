import { isValidObjectId } from 'mongoose'
import connectDB from '@/config/database'
import Message from '@/models/Message'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'

const MAX_MESSAGE_LENGTH = 2000

// Empty form fields become undefined so they aren't saved
const text = (formData: FormData, name: string) => {
  const value = formData.get(name)
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined
}

// GET /api/messages
// Messages the signed-in user received: unread first, then newest first
export const GET = async () => {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return Response.json(
        { message: 'You must be signed in to see your messages' },
        { status: 401 },
      )
    }

    await connectDB()

    const messages = await Message.find({ recipient: sessionUser.userId })
      .sort({ read: 1, createdAt: -1 })
      .populate('property', 'name')
      .lean()

    return Response.json(messages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/messages
// Send a message to a property's owner from the Contact Property Manager form
export const POST = async (request: Request) => {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return Response.json(
        { message: 'You must be signed in to send a message' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const propertyId = text(formData, 'property')
    const body = text(formData, 'body')

    if (!propertyId || !isValidObjectId(propertyId)) {
      return Response.json({ message: 'Property not found' }, { status: 404 })
    }
    if (body && body.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          message: `Messages can be at most ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 },
      )
    }

    await connectDB()

    // The recipient is the property's owner, looked up here so the form
    // can't send messages to anyone else
    const property = await Property.findById(propertyId).lean<{
      owner: unknown
    }>()
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 })
    }

    const recipient = String(property.owner)
    // Sample properties have placeholder owners that aren't real users
    if (!isValidObjectId(recipient)) {
      return Response.json(
        { message: "This property's manager can't receive messages yet" },
        { status: 400 },
      )
    }
    if (recipient === sessionUser.userId) {
      return Response.json(
        { message: "You can't send a message to yourself" },
        { status: 400 },
      )
    }

    const message = new Message({
      sender: sessionUser.userId,
      recipient,
      property: propertyId,
      name: text(formData, 'name'),
      email: text(formData, 'email'),
      phone: text(formData, 'phone'),
      body,
    })

    if (message.validateSync()) {
      return Response.json(
        { message: 'Please fill in your name, email and message' },
        { status: 400 },
      )
    }

    await message.save()

    return Response.json({ message: 'Message sent' }, { status: 201 })
  } catch (error) {
    console.error('Failed to send message:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
