import Image from 'next/image'
import { redirect } from 'next/navigation'
import profileDefault from '@/assets/images/profile.png'
import ProfileProperties from '@/components/ProfileProperties'
import { getSessionUser } from '@/utils/getSessionUser'
import { fetchUserProperties } from '@/utils/requests'

const ProfilePage = async () => {
  // Only signed-in users have a profile
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    redirect('/api/auth/signin?callbackUrl=/profile')
  }

  const { user, userId } = sessionUser
  const properties = await fetchUserProperties(userId)

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Profile</h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  src={user.image || profileDefault}
                  alt='User'
                  width={200}
                  height={200}
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                <span className='font-bold block'>Name: </span> {user.name}
              </h2>
              <h2 className='text-2xl break-all'>
                <span className='font-bold block'>Email: </span> {user.email}
              </h2>
            </div>

            <div className='md:w-3/4 md:pl-4'>
              <h2 className='text-xl font-semibold mb-4'>Your Listings</h2>
              <ProfileProperties properties={properties} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
