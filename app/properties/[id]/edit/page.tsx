import { notFound, redirect } from 'next/navigation'
import PropertyEditForm from '@/components/PropertyEditForm'
import { getSessionUser } from '@/utils/getSessionUser'
import { fetchProperty } from '@/utils/requests'

const EditPropertyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  // Only signed-in users can edit, and only their own properties
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    redirect(`/api/auth/signin?callbackUrl=/properties/${id}/edit`)
  }

  const property = await fetchProperty(id)
  if (!property || property.owner !== sessionUser.userId) {
    notFound()
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 m-4 md:m-0'>
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  )
}

export default EditPropertyPage
