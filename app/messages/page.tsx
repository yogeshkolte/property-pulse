import { redirect } from 'next/navigation'
import Messages from '@/components/Messages'
import { getSessionUser } from '@/utils/getSessionUser'

const MessagesPage = async () => {
  // Only signed-in users have messages
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    redirect('/api/auth/signin?callbackUrl=/messages')
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24 max-w-6xl'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Messages</h1>
          <Messages />
        </div>
      </div>
    </section>
  )
}

export default MessagesPage
