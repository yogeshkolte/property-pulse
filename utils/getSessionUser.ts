import { connection } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/authOptions'

// The signed-in user's session details on the server, or null if signed out
export const getSessionUser = async () => {
  // Sessions are per request, so never prerender anything that reads one
  await connection()

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  return { user: session.user, userId: session.user.id }
}
