'use client'

import { FaShare } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Share Property button: opens the device's share sheet where available
// (phones, Safari, Edge), otherwise copies the property's link
const ShareButton = ({ name }: { name: string }) => {
  const handleClick = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: name, url })
      } catch {
        // The user closed the share sheet; nothing to do
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <button
      className='bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'
      onClick={handleClick}
    >
      <FaShare className='mr-2' /> Share Property
    </button>
  )
}

export default ShareButton
