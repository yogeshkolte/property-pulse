import type { NextRequest } from 'next/server'
import cloudinary, { isCloudinaryConfigured } from '@/config/cloudinary'
import connectDB from '@/config/database'
import Property from '@/models/Property'
import { getSessionUser } from '@/utils/getSessionUser'
import { propertyFieldsFromFormData } from '@/utils/propertyFormData'

const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const CLOUDINARY_FOLDER = 'propertypulse'

const DEFAULT_PAGE_SIZE = 9
const MAX_PAGE_SIZE = 50

// A whole number from the URL, or the fallback when missing or invalid
const positiveInt = (value: string | null, fallback: number) => {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

// GET /api/properties?page=1&pageSize=9
// One page of properties, newest first, with the totals needed for paging
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl
    const pageSize = Math.min(
      positiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE,
    )

    await connectDB()

    const total = await Property.countDocuments()
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    // Pages past the end show the last page
    const page = Math.min(positiveInt(searchParams.get('page'), 1), totalPages)

    // _id breaks ties so items never repeat or vanish between pages
    const properties = await Property.find({})
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    return Response.json({ properties, total, page, pageSize, totalPages })
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/properties
export const POST = async (request: Request) => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return Response.json(
      { message: 'You must be signed in to add a property' },
      { status: 401 },
    )
  }

  // Cloudinary ids of uploaded images, so they can be removed if saving fails
  const uploadedImageIds: string[] = []

  try {
    const formData = await request.formData()

    // Browsers send an empty file entry when no file was picked
    const images = formData
      .getAll('images')
      .filter((image): image is File => image instanceof File && image.size > 0)

    if (images.length === 0 || images.length > MAX_IMAGES) {
      return Response.json(
        { message: `Please select between 1 and ${MAX_IMAGES} images` },
        { status: 400 },
      )
    }
    for (const image of images) {
      if (!IMAGE_TYPES.includes(image.type)) {
        return Response.json(
          { message: 'Images must be JPEG, PNG or WebP files' },
          { status: 400 },
        )
      }
      if (image.size > MAX_IMAGE_BYTES) {
        return Response.json(
          { message: 'Each image must be 5 MB or smaller' },
          { status: 400 },
        )
      }
    }

    // Validate everything except the images before writing any files
    const property = new Property({
      owner: sessionUser.userId,
      ...propertyFieldsFromFormData(formData),
    })

    const validationError = property.validateSync()
    if (validationError) {
      return Response.json(
        { message: 'Please fill in all required fields' },
        { status: 400 },
      )
    }

    if (!isCloudinaryConfigured()) {
      console.error(
        'Cloudinary is not configured: add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) to .env',
      )
      return Response.json(
        { message: 'Image uploads are not set up yet' },
        { status: 500 },
      )
    }

    // Upload the images to Cloudinary and store their URLs
    const imageUrls: string[] = []
    for (const image of images) {
      const base64 = Buffer.from(await image.arrayBuffer()).toString('base64')
      const result = await cloudinary.uploader.upload(
        `data:${image.type};base64,${base64}`,
        { folder: CLOUDINARY_FOLDER },
      )
      uploadedImageIds.push(result.public_id)
      imageUrls.push(result.secure_url)
    }
    property.images = imageUrls

    await connectDB()
    await property.save()

    // Send the browser to the new property's page
    return Response.redirect(
      new URL(`/properties/${property._id}`, request.url),
      303,
    )
  } catch (error) {
    // Don't leave orphaned images in Cloudinary if saving failed
    await Promise.all(
      uploadedImageIds.map((id) =>
        cloudinary.uploader.destroy(id).catch(() => {}),
      ),
    )
    console.error('Failed to add property:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
