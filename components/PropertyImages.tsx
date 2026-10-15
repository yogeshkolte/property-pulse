'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import { propertyImageUrl } from '@/utils/propertyImageUrl'

type Size = { width: number; height: number }

// Used until a photo has loaded and its real shape is known
const FALLBACK_SIZE: Size = { width: 1600, height: 1067 }

// Every photo of a property, shown below its details. Clicking a photo opens
// it full screen in a PhotoSwipe lightbox, where you can zoom and swipe or
// use the arrow keys to move between photos.
const PropertyImages = ({ images }: { images: string[] }) => {
  // PhotoSwipe needs each photo's full-size dimensions, which aren't stored
  // with the property. Until they're known, the shape of the photo shown on
  // the page is used (Next.js resizes photos but keeps their shape); the full
  // sizes are measured as soon as the visitor points at or taps a photo, so
  // they're usually ready before the click.
  const [sizes, setSizes] = useState<Record<string, Size>>({})
  const measuring = useRef(new Map<string, Promise<void>>())

  const rememberSize = (image: string, size: Size) => {
    if (size.width && size.height) {
      setSizes((current) =>
        current[image]?.width === size.width
          ? current
          : { ...current, [image]: size },
      )
    }
  }

  // Load the original photo once to find its real size
  const measureOriginal = (image: string) => {
    let promise = measuring.current.get(image)
    if (!promise) {
      promise = new Promise<void>((resolve) => {
        const img = new window.Image()
        img.onload = () => {
          rememberSize(image, {
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
          resolve()
        }
        img.onerror = () => resolve()
        img.src = propertyImageUrl(image)
      })
      measuring.current.set(image, promise)
    }
    return promise
  }

  const rememberDisplayedSize =
    (image: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Never replace a measured original with the smaller displayed size
      if (!measuring.current.has(image)) {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget
        rememberSize(image, { width, height })
      }
    }

  // The lightbox lets you move between all photos, so measure them all
  // (a property has at most 4)
  const measureAll = () => Promise.all(images.map(measureOriginal))

  const openWhenMeasured =
    (open: (e: React.MouseEvent) => void) => async (e: React.MouseEvent) => {
      await measureAll()
      // Let React pass the new sizes to the gallery before opening
      requestAnimationFrame(() => open(e))
    }

  return (
    <section className='bg-blue-50 p-4'>
      <div className='container mx-auto'>
        <Gallery options={{ bgOpacity: 0.9 }} withCaption>
          <div className='grid grid-cols-2 gap-4'>
            {images.map((image, index) => {
              const src = propertyImageUrl(image)
              const { width, height } = sizes[image] ?? FALLBACK_SIZE
              // A lone photo, or an odd one out at the end, spans both columns
              const fullWidth =
                images.length === 1 ||
                (images.length % 2 === 1 && index === images.length - 1)

              return (
                <div
                  key={image}
                  className={fullWidth ? 'col-span-2' : 'col-span-1'}
                >
                  <Item
                    original={src}
                    thumbnail={src}
                    width={width}
                    height={height}
                    caption={`Photo ${index + 1} of ${images.length}`}
                    // The thumbnail is cropped (object-cover), so the opening
                    // animation zooms from the visible part
                    cropped
                  >
                    {({ ref, open }) => (
                      <Image
                        ref={ref}
                        onClick={openWhenMeasured(open)}
                        onPointerEnter={measureAll}
                        onTouchStart={measureAll}
                        onLoad={rememberDisplayedSize(image)}
                        src={src}
                        alt={`Property photo ${index + 1}`}
                        className='object-cover h-[400px] w-full rounded-xl cursor-zoom-in'
                        width={1800}
                        height={400}
                        sizes={
                          fullWidth ? '100vw' : '(min-width: 768px) 50vw, 100vw'
                        }
                      />
                    )}
                  </Item>
                </div>
              )
            })}
          </div>
        </Gallery>
      </div>
    </section>
  )
}

export default PropertyImages
