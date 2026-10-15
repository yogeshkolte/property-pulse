import React, { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import '@/assets/styles/globals.css'

export const metadata = {
  title: 'Property Pulse |Find perfect rental and sale properties',
  description: 'Discover your dream home with Property Pulse - the ultimate real estate platform for finding and buying properties.',
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className='flex min-h-screen flex-col'>
        <AuthProvider>
          {/* Navbar reads the current URL, so it may stream in on dynamic routes */}
          <Suspense
            fallback={<div className='h-20 bg-blue-700 border-b border-blue-500' />}
          >
            <Navbar />
          </Suspense>
          <main className='flex grow flex-col'>{children}</main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}

export default MainLayout
