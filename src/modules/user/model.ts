import { GenderType, Role, RoleType } from './../enums'
import mongoose, { Types, Model, SchemaDefinitionProperty } from 'mongoose'

export type IBaseVerificationToken = {
  expiryTime: Date
  token: string
  expired: boolean
}
export interface IPasswordResetToken extends IBaseVerificationToken {}
export interface IEmailVerificationToken extends IBaseVerificationToken {}
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
  passowrdResetToken?: IPasswordResetToken
  emailVerificationToken?: IEmailVerificationToken
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}

const BaseVerificationTokenSchema = (args?: any) => {
  let schema = new mongoose.Schema<IBaseVerificationToken>({
    expiryTime: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  })

  if (args) {
    schema.add(args)
  }

  return schema
}

const PasswordResetToken = BaseVerificationTokenSchema()
const EmailVerificationToken = BaseVerificationTokenSchema()

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
    passowrdResetToken: PasswordResetToken,
    emailVerificationToken: EmailVerificationToken,
  },
  { timestamps: true }
)

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema)

export default User
