import { Schema, model, models, type InferSchemaType } from 'mongoose'

const UserSchema = new Schema(
  {
    // Primary identifier; matches the email on the user's Google account
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true,
  },
)

export type UserDocument = InferSchemaType<typeof UserSchema>

// Reuse the compiled model on hot reload instead of redefining it
const User = models.User || model('User', UserSchema)

export default User
