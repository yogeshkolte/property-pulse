import { redirect } from 'next/navigation'
import PropertyAddForm from '@/components/PropertyAddForm'
import { getSessionUser } from '@/utils/getSessionUser'

const AddPropertyPage = async () => {
  // Only signed-in users can add properties
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    redirect('/api/auth/signin?callbackUrl=/properties/add')
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 m-4 md:m-0'>
          <PropertyAddForm />
        </div>
      </div>
    </section>
  )
}

export default AddPropertyPage
