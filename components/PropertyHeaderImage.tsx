import Image from 'next/image'
import { propertyImageUrl } from '@/utils/propertyImageUrl'

const PropertyHeaderImage = ({ image }: { image: string }) => {
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          <Image
            src={propertyImageUrl(image)}
            alt=''
            className='object-cover h-[400px] w-full'
            width={0}
            height={0}
            sizes='100vw'
            loading='eager'
          />
        </div>
      </div>
    </section>
  )
}

export default PropertyHeaderImage
