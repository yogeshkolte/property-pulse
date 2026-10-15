import { isValidObjectId } from 'mongoose'
import cloudinary from '@/config/cloudinary'
import connectDB from '@/config/database'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'
import { propertyFieldsFromFormData } from '@/utils/propertyFormData'

// GET /api/properties/:id
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params

    // Ids that can't be MongoDB ids can't match a property
    if (!isValidObjectId(id)) {
      return Response.json({ message: 'Property not found' }, { status: 404 })
    }

    await connectDB()

    const property = await Property.findById(id).lean()

    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 })
    }

    return Response.json(property)
  } catch (error) {
    console.error('Failed to fetch property:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// Find a property the signed-in user owns, or the error response to send
const findOwnProperty = async (id: string) => {
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
      error: Response.json({ message: 'Property not found' }, { status: 404 }),
    }
  }

  await connectDB()

  const property = await Property.findById(id)
  if (!property) {
    return {
      error: Response.json({ message: 'Property not found' }, { status: 404 }),
    }
  }

  if (property.owner.toString() !== sessionUser.userId) {
    return {
      error: Response.json(
        { message: 'You can only change your own properties' },
        { status: 403 },
      ),
    }
  }

  return { property }
}

// The Cloudinary public id of an uploaded image, e.g.
// https://res.cloudinary.com/demo/image/upload/v123/propertypulse/abc.jpg
// -> propertypulse/abc. Null for local sample images.
const cloudinaryPublicId = (image: string) =>
  image.match(
    /^https:\/\/res\.cloudinary\.com\/.+?\/upload\/(?:v\d+\/)?(.+)\.\w+$/,
  )?.[1] ?? null

// PUT /api/properties/:id
// Update a property's details from the Edit Property form (images stay as they are)
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params
    const { property, error } = await findOwnProperty(id)
    if (error) {
      return error
    }

    const formData = await request.formData()
    property.set(propertyFieldsFromFormData(formData))

    if (property.validateSync()) {
      return Response.json(
        { message: 'Please fill in all required fields' },
        { status: 400 },
      )
    }

    await property.save()

    return Response.json(property)
  } catch (error) {
    console.error('Failed to update property:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// DELETE /api/properties/:id
// Delete a property and its Cloudinary images
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params
    const { property, error } = await findOwnProperty(id)
    if (error) {
      return error
    }

    const publicIds = (property.images as string[])
      .map(cloudinaryPublicId)
      .filter((publicId): publicId is string => publicId !== null)

    await property.deleteOne()

    // The property is gone either way, so a failed image clean-up is only logged
    await Promise.all(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId).catch((destroyError) => {
          console.error(`Failed to delete image ${publicId}:`, destroyError)
        }),
      ),
    )

    return Response.json({ message: 'Property deleted' })
  } catch (error) {
    console.error('Failed to delete property:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
