'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import PropertyFormFields from '@/components/PropertyFormFields'
import type { Property } from '@/types/property'

// Edit Property form: same fields as Add Property, filled in with the
// property's current values. Images can't be changed here.
const PropertyEditForm = ({ property }: { property: Property }) => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      // HTML forms can't send PUT requests, so submit with fetch
      const res = await fetch(`/api/properties/${property._id}`, {
        method: 'PUT',
        body: new FormData(e.currentTarget),
      })

      if (!res.ok) {
        const { message } = await res.json()
        setError(message ?? 'Something went wrong')
        setSaving(false)
        return
      }

      router.push(`/properties/${property._id}`)
      router.refresh()
    } catch {
      setError('Something went wrong')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-3xl text-center font-semibold mb-6'>Edit Property</h2>

      <PropertyFormFields property={property} />

      {error && <p className='mb-4 text-red-600'>{error}</p>}

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50'
          type='submit'
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Property'}
        </button>
      </div>
    </form>
  )
}

export default PropertyEditForm
