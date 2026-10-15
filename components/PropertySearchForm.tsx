import Form from 'next/form'
import {
  SEARCH_PROPERTY_TYPES,
  type PropertySearch,
} from '@/utils/propertySearch'

const fieldClass =
  'w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-500'

// Search by location, zip code and property type. Submitting goes to
// /properties/search with the choices in the URL, so results can be shared.
// `search` fills in the current choices on the results page.
const PropertySearchForm = ({ search = {} }: { search?: PropertySearch }) => {
  return (
    <Form
      action='/properties/search'
      className='mt-3 mx-auto max-w-3xl w-full flex flex-col md:flex-row items-center gap-4 md:gap-3'
    >
      <div className='w-full md:w-2/5'>
        <label htmlFor='location' className='sr-only'>
          Location
        </label>
        <input
          type='text'
          id='location'
          name='location'
          placeholder='City, state, street or keyword'
          defaultValue={search.location}
          className={fieldClass}
        />
      </div>
      <div className='w-full md:w-1/5'>
        <label htmlFor='zipcode' className='sr-only'>
          Zip Code
        </label>
        <input
          type='text'
          id='zipcode'
          name='zipcode'
          inputMode='numeric'
          placeholder='Zip code'
          defaultValue={search.zipcode}
          className={fieldClass}
        />
      </div>
      <div className='w-full md:w-1/4'>
        <label htmlFor='property-type' className='sr-only'>
          Property Type
        </label>
        <select
          id='property-type'
          name='propertyType'
          defaultValue={search.propertyType ?? 'All'}
          className={fieldClass}
        >
          {SEARCH_PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button
        type='submit'
        className='w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-3 focus:ring-blue-500'
      >
        Search
      </button>
    </Form>
  )
}

export default PropertySearchForm
