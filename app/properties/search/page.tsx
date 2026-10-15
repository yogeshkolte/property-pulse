import Link from 'next/link'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import PropertyCard from '@/components/PropertyCard'
import PropertySearchBar from '@/components/PropertySearchBar'
import {
  parsePropertySearch,
  propertySearchQuery,
} from '@/utils/propertySearch'
import { searchProperties } from '@/utils/requests'

// Describe the search in words, e.g. "Condo in "Boston", zip 021"
const describeSearch = ({
  location,
  propertyType,
  zipcode,
}: ReturnType<typeof parsePropertySearch>) => {
  const parts = [
    propertyType ?? 'All properties',
    location && `matching "${location}"`,
    zipcode && `in zip code ${zipcode}*`,
  ]
  return parts.filter(Boolean).join(' ')
}

const SearchResultsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
  const search = parsePropertySearch(await searchParams)
  const properties = await searchProperties(search)

  return (
    <>
      {/* key resets the form's fields when the search changes */}
      <PropertySearchBar key={propertySearchQuery(search)} search={search} />

      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <Link
            href='/properties'
            className='flex items-center text-blue-500 hover:underline mb-3'
          >
            <FaArrowAltCircleLeft className='mr-2 mb-1' /> Back To Properties
          </Link>
          <h1 className='text-2xl mb-1'>Search Results</h1>
          <p className='text-gray-600 mb-4'>
            {describeSearch(search)}: {properties.length}{' '}
            {properties.length === 1 ? 'property' : 'properties'} found
          </p>

          {properties.length === 0 ? (
            <p>No properties match your search. Try fewer or broader terms.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default SearchResultsPage
