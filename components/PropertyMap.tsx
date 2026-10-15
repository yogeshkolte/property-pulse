import PropertyMapClient from '@/components/PropertyMapClient'
import { geocodeAddress } from '@/utils/requests'
import type { Property } from '@/types/property'

const PropertyMap = async ({
  location,
}: {
  location: Property['location']
}) => {
  const { street, city, state, zipcode } = location

  // Fall back to the city if the street address can't be found
  const coordinates =
    (await geocodeAddress(`${street}, ${city}, ${state} ${zipcode}`)) ??
    (await geocodeAddress(`${city}, ${state} ${zipcode}`))

  if (!coordinates) {
    return <p className='text-gray-500'>No location data found</p>
  }

  return <PropertyMapClient lat={coordinates.lat} lng={coordinates.lng} />
}

export default PropertyMap
