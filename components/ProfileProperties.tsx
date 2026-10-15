'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import type { Property } from '@/types/property'
import { propertyImageUrl } from '@/utils/propertyImageUrl'

// The signed-in user's own listings on their profile page, with Edit and
// Delete buttons
const ProfileProperties = ({
  properties: initialProperties,
}: {
  properties: Property[]
}) => {
  const [properties, setProperties] = useState(initialProperties)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`Delete "${property.name}"? This can't be undone.`)) {
      return
    }

    setDeletingId(property._id)
    try {
      const res = await fetch(`/api/properties/${property._id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message ?? 'Failed to delete the property')
        return
      }

      setProperties((current) =>
        current.filter(({ _id }) => _id !== property._id),
      )
      toast.success(`"${property.name}" was deleted`)
    } catch {
      toast.error('Failed to delete the property')
    } finally {
      setDeletingId(null)
    }
  }

  if (properties.length === 0) {
    return <p>You have no property listings yet.</p>
  }

  return properties.map((property) => {
    const { street, city, state } = property.location

    return (
      <div key={property._id} className='mb-10'>
        <Link href={`/properties/${property._id}`}>
          <Image
            src={propertyImageUrl(property.images[0])}
            alt={property.name}
            width={1000}
            height={200}
            className='h-32 w-full rounded-md object-cover'
          />
        </Link>
        <div className='mt-2'>
          <p className='text-lg font-semibold'>{property.name}</p>
          <p className='text-gray-600'>
            Address: {[street, city, state].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className='mt-2'>
          <Link
            href={`/properties/${property._id}/edit`}
            className='inline-block bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600'
          >
            Edit
          </Link>
          <button
            className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 disabled:opacity-50'
            type='button'
            onClick={() => handleDelete(property)}
            disabled={deletingId === property._id}
          >
            {deletingId === property._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    )
  })
}

export default ProfileProperties
