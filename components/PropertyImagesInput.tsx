'use client'

import { useState, type ChangeEvent } from 'react'

const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

type Preview = { name: string; url: string }

// File picker for property photos: checks the count and size before the form
// is submitted, and shows thumbnails of what was picked
const PropertyImagesInput = ({ className }: { className: string }) => {
  const [previews, setPreviews] = useState<Preview[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const files = Array.from(input.files ?? [])

    // Free the previous thumbnails before making new ones
    previews.forEach((preview) => URL.revokeObjectURL(preview.url))

    let error = ''
    if (files.length > MAX_IMAGES) {
      error = `Please select no more than ${MAX_IMAGES} images (you picked ${files.length}).`
    } else if (files.some((file) => file.size > MAX_IMAGE_BYTES)) {
      error = 'Each image must be 5 MB or smaller.'
    }
    // Blocks the submit and shows the message in the browser's own popup
    input.setCustomValidity(error)
    if (error) {
      input.reportValidity()
    }

    setPreviews(
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    )
  }

  return (
    <>
      <input
        type='file'
        id='images'
        name='images'
        className={className}
        accept='image/jpeg,image/png,image/webp'
        multiple
        required
        onChange={handleChange}
      />
      {previews.length > 0 && (
        <div className='mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2'>
          {previews.map((preview, index) => (
            <figure key={preview.url} className='relative'>
              {/* Local file previews can't go through next/image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.name}
                className={`h-24 w-full rounded object-cover ${
                  index >= MAX_IMAGES ? 'opacity-40' : ''
                }`}
              />
              <figcaption className='truncate text-xs text-gray-500 mt-1'>
                {preview.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  )
}

export default PropertyImagesInput
