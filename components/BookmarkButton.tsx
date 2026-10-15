'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FaBookmark } from 'react-icons/fa'
import { toast } from 'react-toastify'

const buttonClass =
  'text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center disabled:opacity-50'

// Bookmark / Remove Bookmark button on the property details page
const BookmarkButton = ({ propertyId }: { propertyId: string }) => {
  const { data: session, status } = useSession()
  // null until we know whether the signed-in user bookmarked this property
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)

  const signedIn = Boolean(session)
  const loading =
    saving || status === 'loading' || (signedIn && isBookmarked === null)

  // Find out whether the signed-in user already bookmarked this property
  useEffect(() => {
    if (!signedIn) {
      return
    }

    let ignore = false
    fetch(`/api/bookmarks/${propertyId}`)
      .then((res) => (res.ok ? res.json() : { isBookmarked: false }))
      .then((data: { isBookmarked: boolean }) => {
        if (!ignore) {
          setIsBookmarked(data.isBookmarked)
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsBookmarked(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [propertyId, signedIn])

  const handleClick = async () => {
    if (!session) {
      toast.error('You need to be signed in to bookmark a property')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/bookmarks/${propertyId}`, {
        method: isBookmarked ? 'DELETE' : 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Something went wrong')
        return
      }

      setIsBookmarked(data.isBookmarked)
      toast.success(data.message)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return isBookmarked ? (
    <button
      className={`${buttonClass} bg-red-500 hover:bg-red-600`}
      onClick={handleClick}
      disabled={loading}
    >
      <FaBookmark className='mr-2' /> Remove Bookmark
    </button>
  ) : (
    <button
      className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
      onClick={handleClick}
      disabled={loading}
    >
      <FaBookmark className='mr-2' /> Bookmark Property
    </button>
  )
}

export default BookmarkButton
