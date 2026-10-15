const Spinner = () => {
  return (
    <div className='flex justify-center my-24' role='status'>
      <div className='h-24 w-24 rounded-full border-8 border-blue-100 border-t-blue-500 animate-spin'></div>
      <span className='sr-only'>Loading...</span>
    </div>
  )
}

export default Spinner
