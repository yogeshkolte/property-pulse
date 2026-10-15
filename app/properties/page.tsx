import React from 'react'
import Pagination from '@/components/Pagination'
import PropertyCard from '@/components/PropertyCard'
import PropertySearchBar from '@/components/PropertySearchBar'
import { fetchProperties } from '@/utils/requests'

const PropertiesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) => {
  const { page: pageParam } = await searchParams
  const { properties, total, page, pageSize, totalPages } =
    await fetchProperties({ page: Number(pageParam) || 1 })

  const first = (page - 1) * pageSize + 1
  const last = first + properties.length - 1

  return (
    <>
      <PropertySearchBar />
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {properties.length === 0 ? (
            <p>No properties found</p>
          ) : (
            <>
              <p className='text-gray-600 mb-4'>
                Showing {first}–{last} of {total} properties
              </p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            href={(number) =>
              number === 1 ? '/properties' : `/properties?page=${number}`
            }
          />
        </div>
      </section>
    </>
  )
}

export default PropertiesPage
