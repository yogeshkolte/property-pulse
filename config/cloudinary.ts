import { v2 as cloudinary } from 'cloudinary'

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env

// Either the three separate settings, or a single CLOUDINARY_URL
// (cloudinary://key:secret@cloud_name), which the SDK reads by itself
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
}
cloudinary.config({ secure: true })

export const isCloudinaryConfigured = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  return Boolean(cloud_name && api_key && api_secret)
}

export default cloudinary
