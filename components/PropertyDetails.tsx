import { Suspense } from 'react'
import {
  FaBath,
  FaBed,
  FaCheck,
  FaMapMarker,
  FaRulerCombined,
  FaTimes,
} from 'react-icons/fa'
import PropertyMap from '@/components/PropertyMap'
import Spinner from '@/components/Spinner'
import type { Property } from '@/types/property'

const RateOption = ({ label, rate }: { label: string; rate?: number }) => {
  return (
    <div className='flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0'>
      <div className='text-gray-500 mr-2 font-bold'>{label}</div>
      <div className='text-2xl font-bold text-blue-500'>
        {rate ? (
          `$${rate.toLocaleString('en-US')}`
        ) : (
          <FaTimes className='text-red-700' />
        )}
      </div>
    </div>
  )
}

const PropertyDetails = ({ property }: { property: Property }) => {
  const { street, city, state, zipcode } = property.location

  return (
    <main>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <div className='text-gray-500 mb-4'>{property.type}</div>
        <h1 className='text-3xl font-bold mb-4'>{property.name}</h1>
        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
          <FaMapMarker className='text-lg text-orange-700 mr-2 mt-1' />
          <p className='text-orange-700'>
            {street} {city}, {state} {zipcode}
          </p>
        </div>

        <h3 className='text-lg font-bold my-6 bg-gray-800 text-white p-2'>
          Rates & Options
        </h3>
        <div className='flex flex-col md:flex-row justify-around'>
          <RateOption label='Nightly' rate={property.rates?.nightly} />
          <RateOption label='Weekly' rate={property.rates?.weekly} />
          <RateOption label='Monthly' rate={property.rates?.monthly} />
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6'>Description & Details</h3>
        <div className='flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9'>
          <p>
            <FaBed className='inline mr-2' /> {property.beds}{' '}
            <span className='hidden sm:inline'>Beds</span>
          </p>
          <p>
            <FaBath className='inline mr-2' /> {property.baths}{' '}
            <span className='hidden sm:inline'>Baths</span>
          </p>
          <p>
            <FaRulerCombined className='inline mr-2' />
            {property.square_feet.toLocaleString('en-US')}{' '}
            <span className='hidden sm:inline'>sqft</span>
          </p>
        </div>
        <p className='text-gray-500 mb-4'>{property.description}</p>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6'>Amenities</h3>
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none'>
          {property.amenities.map((amenity) => (
            <li key={amenity}>
              <FaCheck className='inline text-green-600 mr-2' />
              {amenity}
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <Suspense fallback={<Spinner />}>
          <PropertyMap location={property.location} />
        </Suspense>
      </div>
    </main>
  )
}

export default PropertyDetails
