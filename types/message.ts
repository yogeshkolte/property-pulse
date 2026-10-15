// A received message as sent to components (ids and dates as strings)
export type Message = {
  _id: string
  sender: string
  recipient: string
  // The property it's about; null if the property has since been deleted
  property: { _id: string; name: string } | null
  name: string
  email: string
  phone?: string
  body: string
  read: boolean
  createdAt: string
  updatedAt: string
}
