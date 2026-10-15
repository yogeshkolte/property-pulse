import PropertyFormFields, {
  inputClass,
  labelClass,
} from '@/components/PropertyFormFields'
import PropertyImagesInput from '@/components/PropertyImagesInput'

const PropertyAddForm = () => {
  return (
    <form action='/api/properties' method='POST' encType='multipart/form-data'>
      <h2 className='text-3xl text-center font-semibold mb-6'>Add Property</h2>

      <PropertyFormFields />

      <div className='mb-4'>
        <label htmlFor='images' className={labelClass}>
          Images (Select up to 4 images)
        </label>
        <PropertyImagesInput className={inputClass} />
      </div>

      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Add Property
        </button>
      </div>
    </form>
  )
}

export default PropertyAddForm
