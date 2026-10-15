import { cacheLife } from 'next/cache'
import type { Property } from '@/types/property'
import {
  propertySearchQuery,
  type PropertySearch,
} from '@/utils/propertySearch'

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN_URL

export type PropertiesPage = {
  properties: Property[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Fetch one page of properties from the API, newest first
export const fetchProperties = async ({
  page = 1,
  pageSize,
}: { page?: number; pageSize?: number } = {}): Promise<PropertiesPage> => {
  if (!apiDomain) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN_URL is not defined in .env')
  }

  const params = new URLSearchParams({ page: String(page) })
  if (pageSize) {
    params.set('pageSize', String(pageSize))
  }
  const res = await fetch(`${apiDomain}/properties?${params}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch properties: ${res.status}`)
  }

  return res.json()
}

// Fetch a random selection of properties from the API
export const fetchRandomProperties = async (
  count: number,
): Promise<Property[]> => {
  if (!apiDomain) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN_URL is not defined in .env')
  }

  const res = await fetch(`${apiDomain}/properties/random?count=${count}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch random properties: ${res.status}`)
  }

  return res.json()
}

// Fetch a single property from the API; null if it doesn't exist
export const fetchProperty = async (id: string): Promise<Property | null> => {
  if (!apiDomain) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN_URL is not defined in .env')
  }

  const res = await fetch(`${apiDomain}/properties/${id}`)

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch property: ${res.status}`)
  }

  return res.json()
}

// Fetch the properties a user has listed from the API, newest first
export const fetchUserProperties = async (
  userId: string,
): Promise<Property[]> => {
  if (!apiDomain) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN_URL is not defined in .env')
  }

  const res = await fetch(`${apiDomain}/properties/user/${userId}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch user properties: ${res.status}`)
  }

  return res.json()
}

// Search properties through the API, newest first
export const searchProperties = async (
  search: PropertySearch,
): Promise<Property[]> => {
  if (!apiDomain) {
    throw new Error('NEXT_PUBLIC_API_DOMAIN_URL is not defined in .env')
  }

  const res = await fetch(
    `${apiDomain}/properties/search?${propertySearchQuery(search)}`,
  )

  if (!res.ok) {
    throw new Error(`Failed to search properties: ${res.status}`)
  }

  return res.json()
}

export type Coordinates = { lat: number; lng: number }

// Look up map coordinates for an address with OpenStreetMap's Nominatim service.
// Cached so each address is only looked up once (their usage policy asks for this).
export const geocodeAddress = async (
  address: string,
): Promise<Coordinates | null> => {
  'use cache'
  cacheLife('max')

  const params = new URLSearchParams({ q: address, format: 'json', limit: '1' })
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { 'User-Agent': 'PropertyPulse/1.0' } },
  )

  if (!res.ok) {
    throw new Error(`Failed to geocode address: ${res.status}`)
  }

  const results: { lat: string; lon: string }[] = await res.json()
  if (results.length === 0) {
    return null
  }

  return { lat: Number(results[0].lat), lng: Number(results[0].lon) }
}
