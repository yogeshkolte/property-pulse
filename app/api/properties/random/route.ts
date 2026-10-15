import type { NextRequest } from 'next/server'
import connectDB from '@/config/database'
import Property from '@/models/Property'

const MAX_COUNT = 12

// GET /api/properties/random?count=3
// A random selection of properties, different on every request
export const GET = async (request: NextRequest) => {
  try {
    const requested = Number(request.nextUrl.searchParams.get('count'))
    const count =
      Number.isInteger(requested) && requested > 0
        ? Math.min(requested, MAX_COUNT)
        : 3

    await connectDB()

    const properties = await Property.aggregate([{ $sample: { size: count } }])

    return Response.json(properties)
  } catch (error) {
    console.error('Failed to fetch random properties:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
