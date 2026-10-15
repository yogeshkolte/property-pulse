import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      // MongoDB id of the signed-in user
      id?: string
    } & DefaultSession['user']
  }
}
