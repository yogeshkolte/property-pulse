import { Schema, model, models, type InferSchemaType } from 'mongoose'

// A message sent to a property's owner from the Contact Property Manager form
const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    // Contact details the sender entered on the form
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
    },
    body: {
      type: String,
      required: [true, 'Message is required'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export type MessageDocument = InferSchemaType<typeof MessageSchema>

// Reuse the compiled model on hot reload instead of redefining it
const Message = models.Message || model('Message', MessageSchema)

export default Message
