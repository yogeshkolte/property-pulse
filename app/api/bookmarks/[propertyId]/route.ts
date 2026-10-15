import { isValidObjectId } from 'mongoose'
import connectDB from '@/config/database'
import Property from '@/models/Property'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

type Context = { params: Promise<{ propertyId: string }> }

// GET /api/bookmarks/:propertyId
// Whether the signed-in user has bookmarked the property
export const GET = async (_request: Request, { params }: Context) => {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return Response.json({ isBookmarked: false })
    }

    const { propertyId } = await params
    if (!isValidObjectId(propertyId)) {
      return Response.json({ isBookmarked: false })
    }

    await connectDB()
    const isBookmarked = Boolean(
      await User.exists({ _id: sessionUser.userId, bookmarks: propertyId }),
    )

    return Response.json({ isBookmarked })
  } catch (error) {
    console.error('Failed to check bookmark:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// Add or remove a bookmark for the signed-in user
const updateBookmark = async (
  { params }: Context,
  action: 'add' | 'remove',
) => {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser) {
      return Response.json(
        { message: 'You must be signed in to bookmark a property' },
        { status: 401 },
      )
    }

    const { propertyId } = await params
    if (!isValidObjectId(propertyId)) {
      return Response.json({ message: 'Property not found' }, { status: 404 })
    }

    await connectDB()

    if (action === 'add') {
      if (!(await Property.exists({ _id: propertyId }))) {
        return Response.json({ message: 'Property not found' }, { status: 404 })
      }
      await User.updateOne(
        { _id: sessionUser.userId },
        { $addToSet: { bookmarks: propertyId } },
      )
      return Response.json({
        isBookmarked: true,
        message: 'Bookmark added',
      })
    }

    await User.updateOne(
      { _id: sessionUser.userId },
      { $pull: { bookmarks: propertyId } },
    )
    return Response.json({
      isBookmarked: false,
      message: 'Bookmark removed',
    })
  } catch (error) {
    console.error('Failed to update bookmark:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/bookmarks/:propertyId — bookmark the property
export const POST = (_request: Request, context: Context) =>
  updateBookmark(context, 'add')

// DELETE /api/bookmarks/:propertyId — remove the bookmark
export const DELETE = (_request: Request, context: Context) =>
  updateBookmark(context, 'remove')
