'use client'

import { useState, type FormEvent } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { FaGoogle, FaPaperPlane } from 'react-icons/fa'
import { toast } from 'react-toastify'
import type { Property } from '@/types/property'

const inputClass =
  'shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
const labelClass = 'block text-gray-700 text-sm font-bold mb-2'

// Contact Property Manager form in the property details sidebar
const PropertyContactForm = ({ property }: { property: Property }) => {
  const { data: session, status } = useSession()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        body: new FormData(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Something went wrong')
        return
      }

      toast.success('Your message has been sent')
      form.reset()
      setSent(true)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  const renderContent = () => {
    if (status === 'loading') {
      return null
    }
    if (!session) {
      // Messages need an account so the owner knows who wrote and spam is
      // kept out; the server refuses them from signed-out visitors too
      return (
        <>
          <p className='mb-4'>You must be signed in to send a message.</p>
          <button
            type='button'
            className='bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full w-full flex items-center justify-center'
            onClick={() =>
              signIn('google', { callbackUrl: window.location.href })
            }
          >
            <FaGoogle className='mr-2' /> Sign in to contact
          </button>
        </>
      )
    }
    if (session.user.id === property.owner) {
      return <p>This is your property, so you can&apos;t message yourself.</p>
    }
    if (sent) {
      return (
        <>
          <p className='text-green-600 mb-4'>Your message has been sent.</p>
          <button
            type='button'
            className='text-blue-500 hover:text-blue-600'
            onClick={() => setSent(false)}
          >
            Send another message
          </button>
        </>
      )
    }

    return (
      <form onSubmit={handleSubmit}>
        <input type='hidden' name='property' value={property._id} />
        <div className='mb-4'>
          <label className={labelClass} htmlFor='contact_name'>
            Name:
          </label>
          <input
            className={inputClass}
            id='contact_name'
            name='name'
            type='text'
            placeholder='Enter your name'
            defaultValue={session.user.name ?? ''}
            required
          />
        </div>
        <div className='mb-4'>
          <label className={labelClass} htmlFor='contact_email'>
            Email:
          </label>
          <input
            className={inputClass}
            id='contact_email'
            name='email'
            type='email'
            placeholder='Enter your email'
            defaultValue={session.user.email ?? ''}
            required
          />
        </div>
        <div className='mb-4'>
          <label className={labelClass} htmlFor='contact_phone'>
            Phone:
          </label>
          <input
            className={inputClass}
            id='contact_phone'
            name='phone'
            type='tel'
            placeholder='Enter your phone number'
          />
        </div>
        <div className='mb-4'>
          <label className={labelClass} htmlFor='contact_message'>
            Message:
          </label>
          <textarea
            className={`${inputClass} h-44`}
            id='contact_message'
            name='body'
            placeholder='Enter your message'
            maxLength={2000}
            required
          ></textarea>
        </div>
        <div>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center disabled:opacity-50'
            type='submit'
            disabled={sending}
          >
            <FaPaperPlane className='mr-2' />
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-bold mb-6'>Contact Property Manager</h3>
      {renderContent()}
    </div>
  )
}

export default PropertyContactForm
