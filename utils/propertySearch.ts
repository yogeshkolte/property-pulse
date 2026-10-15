// Search options for properties, as used in the search form's URL
// (/properties/search?location=...&propertyType=...&zipcode=...)
export type PropertySearch = {
  location?: string
  propertyType?: string
  zipcode?: string
}

// Property types offered in the search form ('All' means any type)
export const SEARCH_PROPERTY_TYPES = [
  'All',
  'Apartment',
  'Studio',
  'Condo',
  'House',
  'Cabin Or Cottage',
  'Loft',
  'Room',
  'Other',
]

// Read search options from URL search params, dropping empty values
export const parsePropertySearch = (
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): PropertySearch => {
  const get = (name: string) => {
    const value =
      params instanceof URLSearchParams ? params.get(name) : params[name]
    const text = (Array.isArray(value) ? value[0] : value)?.trim()
    return text ? text : undefined
  }

  const propertyType = get('propertyType')
  return {
    location: get('location'),
    propertyType: propertyType === 'All' ? undefined : propertyType,
    zipcode: get('zipcode'),
  }
}

// Turn search options back into a query string, leaving out empty values
export const propertySearchQuery = (search: PropertySearch) =>
  new URLSearchParams(
    Object.entries(search).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  ).toString()
