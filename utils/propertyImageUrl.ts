// New uploads are stored as full Cloudinary URLs; the sample data (and any
// earlier local uploads) only store a file name in public/images/properties
export const propertyImageUrl = (image: string) =>
  image.startsWith('http') ? image : `/images/properties/${image}`
