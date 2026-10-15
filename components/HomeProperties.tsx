import { Suspense } from 'react'
import { connection } from 'next/server'
import Link from 'next/link'
import PropertyCard from '@/components/PropertyCard'
import Spinner from '@/components/Spinner'
import { fetchRandomProperties } from '@/utils/requests'

const RandomProperties = async () => {
  // Pick a new set on every request instead of once at build time
  await connection()
  const randomProperties = await fetchRandomProperties(3)

  if (randomProperties.length === 0) {
    return <p>No properties found</p>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {randomProperties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  )
}

const HomeProperties = () => {
  return (
    <>
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
            Recent Properties
          </h2>
          <Suspense fallback={<Spinner />}>
            <RandomProperties />
          </Suspense>
        </div>
      </section>

      <section className='m-auto max-w-lg my-10 px-6'>
        <Link
          href='/properties'
          className='block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700'
        >
          View All Properties
        </Link>
      </section>
    </>
  )
}

export default HomeProperties
