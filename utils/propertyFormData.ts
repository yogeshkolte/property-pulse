// Empty form fields become undefined so they aren't saved
const text = (formData: FormData, name: string) => {
  const value = formData.get(name)
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined
}
const number = (formData: FormData, name: string) => {
  const value = text(formData, name)
  return value === undefined ? undefined : Number(value)
}

// The property fields sent by the Add / Edit Property form (everything except
// the owner and images)
export const propertyFieldsFromFormData = (formData: FormData) => ({
  type: text(formData, 'type'),
  name: text(formData, 'name'),
  description: text(formData, 'description'),
  location: {
    street: text(formData, 'location.street'),
    city: text(formData, 'location.city'),
    state: text(formData, 'location.state'),
    zipcode: text(formData, 'location.zipcode'),
  },
  beds: number(formData, 'beds'),
  baths: number(formData, 'baths'),
  square_feet: number(formData, 'square_feet'),
  amenities: formData.getAll('amenities').map(String),
  rates: {
    weekly: number(formData, 'rates.weekly'),
    monthly: number(formData, 'rates.monthly'),
    nightly: number(formData, 'rates.nightly'),
  },
  seller_info: {
    name: text(formData, 'seller_info.name'),
    email: text(formData, 'seller_info.email'),
    phone: text(formData, 'seller_info.phone'),
  },
})
