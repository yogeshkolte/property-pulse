import type { Property } from '@/types/property'

const PROPERTY_TYPES = [
  'Apartment',
  'Condo',
  'House',
  'Cabin Or Cottage',
  'Room',
  'Studio',
  'Other',
]

const AMENITIES = [
  'Wifi',
  'Full Kitchen',
  'Washer & Dryer',
  'Free Parking',
  'Swimming Pool',
  'Hot Tub',
  '24/7 Security',
  'Wheelchair Accessible',
  'Elevator Access',
  'Dishwasher',
  'Gym/Fitness Center',
  'Air Conditioning',
  'Balcony/Patio',
  'Smart TV',
  'Coffee Maker',
]

const RATES = [
  { label: 'Weekly', key: 'weekly' },
  { label: 'Monthly', key: 'monthly' },
  { label: 'Nightly', key: 'nightly' },
] as const

export const inputClass = 'border border-gray-300 rounded w-full py-2 px-3'
export const labelClass = 'block text-gray-700 font-bold mb-2'

// Everything on the property form except the images and submit button,
// shared by Add Property and Edit Property. When editing, `property` fills in
// the current values.
const PropertyFormFields = ({ property }: { property?: Property }) => {
  // Keep values that aren't in the standard lists (e.g. from the sample data)
  // so editing a property doesn't silently drop them
  const types =
    property && !PROPERTY_TYPES.includes(property.type)
      ? [property.type, ...PROPERTY_TYPES]
      : PROPERTY_TYPES
  const amenities = [
    ...AMENITIES,
    ...(property?.amenities.filter((amenity) => !AMENITIES.includes(amenity)) ??
      []),
  ]

  return (
    <>
      <div className='mb-4'>
        <label htmlFor='type' className={labelClass}>
          Property Type
        </label>
        <select
          id='type'
          name='type'
          className={inputClass}
          defaultValue={property?.type}
          required
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-4'>
        <label htmlFor='name' className={labelClass}>
          Listing Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className={`${inputClass} mb-2`}
          placeholder='eg. Beautiful Apartment In Miami'
          defaultValue={property?.name}
          required
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='description' className={labelClass}>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className={inputClass}
          rows={4}
          placeholder='Add an optional description of your property'
          defaultValue={property?.description}
        ></textarea>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className={labelClass}>Location</label>
        <input
          type='text'
          id='street'
          name='location.street'
          className={`${inputClass} mb-2`}
          placeholder='Street'
          defaultValue={property?.location.street}
        />
        <input
          type='text'
          id='city'
          name='location.city'
          className={`${inputClass} mb-2`}
          placeholder='City'
          defaultValue={property?.location.city}
          required
        />
        <input
          type='text'
          id='state'
          name='location.state'
          className={`${inputClass} mb-2`}
          placeholder='State'
          defaultValue={property?.location.state}
          required
        />
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className={`${inputClass} mb-2`}
          placeholder='Zipcode'
          defaultValue={property?.location.zipcode}
        />
      </div>

      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label htmlFor='beds' className={labelClass}>
            Beds
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            min={0}
            className={inputClass}
            defaultValue={property?.beds}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label htmlFor='baths' className={labelClass}>
            Baths
          </label>
          <input
            type='number'
            id='baths'
            name='baths'
            min={0}
            step='any'
            className={inputClass}
            defaultValue={property?.baths}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label htmlFor='square_feet' className={labelClass}>
            Square Feet
          </label>
          <input
            type='number'
            id='square_feet'
            name='square_feet'
            min={0}
            className={inputClass}
            defaultValue={property?.square_feet}
            required
          />
        </div>
      </div>

      <div className='mb-4'>
        <label className={labelClass}>Amenities</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          {amenities.map((amenity) => {
            const id = `amenity_${amenity.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
            return (
              <div key={amenity}>
                <input
                  type='checkbox'
                  id={id}
                  name='amenities'
                  value={amenity}
                  className='mr-2'
                  defaultChecked={property?.amenities.includes(amenity)}
                />
                <label htmlFor={id}>{amenity}</label>
              </div>
            )
          })}
        </div>
      </div>

      <div className='mb-4 bg-blue-50 p-4'>
        <label className={labelClass}>
          Rates (Leave blank if not applicable)
        </label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          {RATES.map(({ label, key }) => (
            <div key={key} className='flex items-center'>
              <label htmlFor={`rates.${key}`} className='mr-2'>
                {label}
              </label>
              <input
                type='number'
                id={`rates.${key}`}
                name={`rates.${key}`}
                min={0}
                className={inputClass}
                defaultValue={property?.rates?.[key]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mb-4'>
        <label htmlFor='seller_name' className={labelClass}>
          Seller Name
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className={inputClass}
          placeholder='Name'
          defaultValue={property?.seller_info?.name}
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='seller_email' className={labelClass}>
          Seller Email
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className={inputClass}
          placeholder='Email address'
          defaultValue={property?.seller_info?.email}
          required
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='seller_phone' className={labelClass}>
          Seller Phone
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className={inputClass}
          placeholder='Phone'
          defaultValue={property?.seller_info?.phone}
        />
      </div>
    </>
  )
}

export default PropertyFormFields
