import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import BookmarkButton from '@/components/BookmarkButton'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyContactForm from '@/components/PropertyContactForm'
import PropertyDetails from '@/components/PropertyDetails'
import PropertyImages from '@/components/PropertyImages'
import ShareButton from '@/components/ShareButton'
import { fetchProperty } from '@/utils/requests'

const PropertyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const property = await fetchProperty(id)

  if (!property) {
    notFound()
  }

  return (
    <>
      <PropertyHeaderImage image={property.images[0]} />

      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties'
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <FaArrowLeft className='mr-2' /> Back to Properties
          </Link>
        </div>
      </section>

      <section className='bg-blue-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-[7fr_3fr] w-full gap-6'>
            <PropertyDetails property={property} />
            <aside className='space-y-4'>
              <BookmarkButton propertyId={property._id} />
              <ShareButton name={property.name} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property.images} />
    </>
  )
}

export default PropertyPage
