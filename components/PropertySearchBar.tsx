import PropertySearchForm from '@/components/PropertySearchForm'
import type { PropertySearch } from '@/utils/propertySearch'

// Blue bar with the search form, shown above property listings
const PropertySearchBar = ({ search }: { search?: PropertySearch }) => {
  return (
    <section className='bg-blue-700 py-4'>
      <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
        <PropertySearchForm search={search} />
      </div>
    </section>
  )
}

export default PropertySearchBar
