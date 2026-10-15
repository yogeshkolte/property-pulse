import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/config/database'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Show Google's account chooser on every login, so you can switch
          // between Google accounts (handy when testing as different users)
          prompt: 'select_account consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // Create the user in MongoDB the first time they sign in with Google
    async signIn({ profile }) {
      if (!profile?.email) {
        return false
      }

      await connectDB()

      const userExists = await User.findOne({ email: profile.email })
      if (!userExists) {
        // Long Google names can cause layout issues, so cap the username length
        const username = (profile.name ?? profile.email).slice(0, 20)

        await User.create({
          email: profile.email,
          username,
          image: (profile as { picture?: string }).picture,
        })
      }

      return true
    },
    // Add the MongoDB user id to the session so pages can use it
    async session({ session }) {
      if (session.user?.email) {
        await connectDB()
        const user = await User.findOne({ email: session.user.email })
        if (user) {
          session.user.id = user._id.toString()
        }
      }
      return session
    },
  },
}
