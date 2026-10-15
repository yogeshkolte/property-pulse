import type { NextRequest } from 'next/server'
import connectDB from '@/config/database'
import Property from '@/models/Property'
import { parsePropertySearch } from '@/utils/propertySearch'

// Treat user input as plain text inside a regular expression
const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Some types are written both ways round in the data
const TYPE_ALIASES: Record<string, string[]> = {
  'cabin or cottage': ['Cabin Or Cottage', 'Cottage Or Cabin'],
}

// GET /api/properties/search?location=&propertyType=&zipcode=
// All filters are optional and combined; results are newest first
export const GET = async (request: NextRequest) => {
  try {
    const { location, propertyType, zipcode } = parsePropertySearch(
      request.nextUrl.searchParams,
    )

    const filters: Record<string, unknown>[] = []

    // Location matches the start of any word in the address or listing
    // name, so "MA" finds Massachusetts listings and "Main" finds Main St,
    // but "ma" doesn't match the middle of words like "Yamato"
    if (location) {
      const pattern = new RegExp(`\\b${escapeRegExp(location)}`, 'i')
      filters.push({
        $or: [
          { name: pattern },
          { 'location.street': pattern },
          { 'location.city': pattern },
          { 'location.state': pattern },
          { 'location.zipcode': pattern },
        ],
      })
    }

    // Zip codes match from the start, so "021" finds 02108, 02115, ...
    if (zipcode) {
      filters.push({
        'location.zipcode': new RegExp(`^${escapeRegExp(zipcode)}`, 'i'),
      })
    }

    // Exact type, ignoring case
    if (propertyType) {
      const types = TYPE_ALIASES[propertyType.toLowerCase()] ?? [propertyType]
      filters.push({
        type: {
          $in: types.map((type) => new RegExp(`^${escapeRegExp(type)}$`, 'i')),
        },
      })
    }

    await connectDB()

    const properties = await Property.find(
      filters.length > 0 ? { $and: filters } : {},
    )
      .sort({ createdAt: -1 })
      .lean()

    return Response.json(properties)
  } catch (error) {
    console.error('Failed to search properties:', error)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
