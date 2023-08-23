import { GenderType, Role, RoleType } from './../enums'
import mongoose, { Types, Model } from 'mongoose'

export type IOtp = { expiryTime: Date; token: number; expired: boolean }
export interface IUser {
  _id: string
  firstName: string
  role: RoleType
  dob: Date
  lastName: string
  email: string
  emailVerified: Date | null
  country: string
  state: string
  city: string
  address: string
  zipCode: string
  gender: GenderType
  avatar: string
  bio: string
  password: string
  active: boolean
  otp?: IOtp
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const OtpSchema = new mongoose.Schema<IOtp>({
  expiryTime: {
    type: Date,
    required: true,
  },
  token: {
    type: Number,
    required: false,
  },
  expired: {
    type: Boolean,
    default: false,
  },
})

const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    firstName: { type: String },
    role: { type: String },
    dob: { type: Date },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    emailVerified: { type: Date },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    zipCode: { type: String },
    gender: { type: String },
    avatar: { type: String },
    bio: { type: String },
    password: { type: String },
    active: { type: Boolean },
    otp: OtpSchema,
  },
  { timestamps: true }
)

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema)

export default User
