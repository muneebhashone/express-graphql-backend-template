import { checkIfUserAlreadyExist } from './helpers'
import { comparePassword, hashPassword } from '../../utils/auth.utils'
import { GraphQLError } from 'graphql'
import User, { IUser, IUserDocument } from './model'
import { NexusGenInputs, NexusGenObjects } from 'nexus-typegen'
import { signJwt } from '../../utils/jwt.utils'
import { IContextType } from '../../types'
import { FilterQuery } from 'mongoose'
import {
  generateOTP,
  getPaginator,
  objectSanitizer,
} from '../../utils/common.utils'
import mailer from '../../lib/mailer'

export const setPassword = async ({
  payload,
}: {
  payload: NexusGenInputs['SetTestPasswordInput']
}): Promise<NexusGenObjects['ReturnMessageObject']> => {
  try {
    const testPassword = 'password'
    const hashedPassword = await hashPassword(testPassword)

    await User.updateOne(
      { email: payload.email },
      { $set: { password: hashedPassword } }
    )

    return {
      message: `${testPassword} has been set to ${payload.email}`,
      status: 'success',
    }
  } catch (err: any) {
    throw new GraphQLError(err.message)
  }
}

export const updateUser = async ({
  payload,
  ctx,
}: {
  ctx: IContextType
  payload: NexusGenInputs['UserUpdateInput']
}): Promise<NexusGenObjects['User'] | any> => {
  try {
    if (!ctx.user._id) {
      throw new GraphQLError('Unauthorized')
    }

    const userId = ctx.user._id

    const user = await User.findById(userId)

    if (!user) {
      throw new GraphQLError('No user found')
    }

    const { email, ...data } = payload
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true }
    )
    if (userUpdate) return userUpdate
  } catch (err: any) {
    throw new GraphQLError(err.message)
  }
}

export const getUsers = async (
  ctx: IContextType,
  options: NexusGenInputs['UserOptionsInput'],
  paginator: NexusGenInputs['PaginatorFilterInput']
): Promise<NexusGenObjects['UserPaginator'] | any> => {
  const { q, role } = options
  const { limit, page } = paginator

  const filter: FilterQuery<IUserDocument> = {
    role: role || undefined,
    $or: q
      ? [
          { firstName: { $regex: q.toLowerCase(), $options: 'i' } },
          { lastName: { $regex: q.toLowerCase(), $options: 'i' } },
          { email: { $regex: q.toLowerCase(), $options: 'i' } },
        ]
      : undefined,
  }

  const totalRecords = await User.countDocuments(objectSanitizer(filter))

  const paginatorInfo = getPaginator(
    limit as number,
    page as number,
    totalRecords
  )

  const users = await User.find(objectSanitizer(filter))
    .limit(paginatorInfo.limit)
    .skip(paginatorInfo.skip)
    .sort({ createdAt: -1 })

  return {
    data: users.length ? users : null,
    paginatorInfo,
  }
}

export const registerUser = async (
  payload: NexusGenInputs['UserRegistrationInput']
): Promise<NexusGenObjects['User']> => {
  const {
    role,
    confirmPassword,
    email,
    firstName,
    lastName,
    password,
    termsAndCondition,
  } = payload

  if (!termsAndCondition) {
    throw new GraphQLError(
      'You must accept terms and conditions in order to register'
    )
  }

  await checkIfUserAlreadyExist(email)

  if (password !== confirmPassword) {
    throw new GraphQLError('Password and confirm password must be same')
  }

  const hashedPassword = await hashPassword(password)

  const createdUser = await User.create({
    email,
    role,
    firstName,
    lastName,
    active: false,
    password: hashedPassword,
  })

  return createdUser
}

export const loginUser = async (
  payload: NexusGenInputs['LoginInput']
): Promise<any | null> => {
  const { email, password } = payload

  const user = await User.findOne({ email: email })

  if (!user) {
    throw new GraphQLError("User doesn't exist")
  }

  if (!user?.active) {
    throw new GraphQLError('User is activated')
  }

  // @ts-ignore
  if (!(await comparePassword(password as string, user?.password))) {
    throw new GraphQLError('Invalid email or password')
  }

  const tokenUser = {
    _id: user?._id.toString(),
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  }

  const token = signJwt(tokenUser)

  return {
    token,
    ...tokenUser,
  }
}

export const getUser = async (
  ctx: IContextType
): Promise<NexusGenObjects['User']> => {
  const userId = ctx.user._id
  if (!userId) {
    throw new GraphQLError('Not Authorize')
  }

  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new GraphQLError("User doesn't exist")
  }

  return user
}

export const getUserById = async (
  ctx: IContextType,
  payload: NexusGenInputs['GetUserByIdInput']
): Promise<NexusGenObjects['User']> => {
  if (ctx.user) {
    const id = ctx.user._id
    if (!id) {
      throw new GraphQLError('Not Authorize')
    }

    const user = await User.findOne({ _id: payload.userId })

    if (!user) {
      throw new GraphQLError("User doesn't exist")
    }

    return user
  }

  throw new GraphQLError('Not Authorize')
}

export const updatePassword = async (
  payload: NexusGenInputs['UpdatePasswordInput'],
  ctx: IContextType
): Promise<NexusGenObjects['ReturnMessageObject']> => {
  const userId = ctx.user._id
  const { password, confirmPassword, newPassword } = payload

  const user = await User.findOne({ _id: userId })

  if (!user) {
    throw new GraphQLError("User doesn't exist")
  }

  if (!(await comparePassword(password as string, user?.password))) {
    throw new GraphQLError('Invalid password')
  }

  if (newPassword !== confirmPassword) {
    throw new GraphQLError('Password and confirm password must be same')
  }

  const hashedPassword = await hashPassword(newPassword)

  await User.findByIdAndUpdate(
    userId,
    { $set: { password: hashedPassword } },
    { new: true }
  )

  return {
    message: `Password has been successfully updated`,
    status: 'sucesss',
  }
}

export const forgetPassword = async (
  payload: NexusGenInputs['ForgetPasswordInput']
): Promise<NexusGenObjects['ReturnMessageObject']> => {
  const { email } = payload

  const user = await User.findOne({ email })

  if (!user) {
    throw new GraphQLError("Email doesn't exist")
  }

  const currentTime = new Date().getMinutes()
  const expiryTime = new Date().setMinutes(currentTime + 20)
  const otp = generateOTP()
  await mailer.sendMail({
    to: email,
    subject: 'Forget Password',
    text: `Your verification code is ${otp}`,
    // html: '<b>Hello world?</b>',
  })
  await User.findByIdAndUpdate(
    user._id,
    { $set: { otp: { expiryTime, token: otp } } },
    { new: true }
  )

  return {
    message: `Email sent successfully`,
    status: 'sucesss',
  }
}

export const changePassword = async (
  payload: NexusGenInputs['ChangePasswordInput']
): Promise<NexusGenObjects['User'] | any> => {
  let { email, confirmPassword, password, token } = payload

  token = decodeURIComponent(token)

  if (!email) {
    throw new GraphQLError('Something went wrong')
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new GraphQLError("Email doesn't exist")
  }

  if (user.passowrdResetToken?.expired) {
    throw new GraphQLError('Token is expired')
  }

  let expired = false
  if (user.passowrdResetToken && user.passowrdResetToken.expiryTime) {
    expired = new Date() > new Date(user.passowrdResetToken.expiryTime)
  }

  if (expired) {
    throw new GraphQLError('Token is expired')
  }

  const isVerified = await comparePassword(
    user?.passowrdResetToken?.token as string,
    token
  )

  if (!isVerified) {
    throw new GraphQLError('Incorrect Token')
  }

  if (password !== confirmPassword) {
    throw new GraphQLError('Password and confirm password must be same')
  }

  const hashedPassword = await hashPassword(password)

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { passowrdResetToken: { expired: true }, password: hashedPassword },
    },
    { new: true }
  )

  if (updatedUser) return updatedUser
}

export const updateUserById = async ({
  ctx,
  payload,
  userIdInput,
}: {
  ctx: IContextType
  payload: NexusGenInputs['UserUpdateInput']
  userIdInput: NexusGenInputs['GetUserByIdInput']
}): Promise<NexusGenObjects['User'] | any> => {
  try {
    if (!ctx.user._id) {
      throw new GraphQLError('Unauthorized')
    }

    const { userId } = userIdInput

    const user = await User.findById(userId)

    if (!user) {
      throw new GraphQLError('No user found')
    }

    const { email, ...data } = payload
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true }
    )
    if (userUpdate) return userUpdate
  } catch (err: any) {
    throw new GraphQLError(err.message)
  }
}

export const addNewUser = async (
  payload: NexusGenInputs['AddNewUserInput']
): Promise<NexusGenObjects['User']> => {
  const {
    role,
    email,
    firstName,
    lastName,
    password,
    city,
    country,
    state,
    zipCode,
    confirmPassword,
  } = payload

  await checkIfUserAlreadyExist(email)

  if (password !== confirmPassword) {
    throw new GraphQLError('Password and confirm password must be same')
  }

  const hashedPassword = await hashPassword(password)

  const createdUser = await User.create({
    email,
    role,
    firstName,
    lastName,
    city,
    country,
    active: true,
    state,
    zipCode,
    password: hashedPassword,
  })

  return createdUser
}

export const verifyEmail = async (
  payload: NexusGenInputs['EmailVerificationInputType']
): Promise<NexusGenObjects['ReturnMessageObject'] | null> => {
  let { email, token } = payload

  token = decodeURIComponent(token)
  email = decodeURIComponent(email)

  const user = await User.findOne({ email: email })

  if (!user) {
    throw new GraphQLError("User doesn't exist")
  }

  if (
    !(await comparePassword(
      user?.emailVerificationToken?.token as string,
      token as string
    ))
  ) {
    throw new GraphQLError('Invalid or Expired Token')
  }

  const emailVerified = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: { emailVerified: new Date() },
    },
    {
      new: true,
    }
  )

  if (!emailVerified) {
    throw new GraphQLError('Email Verification Failed')
  }

  return {
    message: 'Email Verification Successfull',
    status: 'success',
  }
}

export const deleteUserById = async ({
  ctx,
  userIdInput,
}: {
  ctx: IContextType
  userIdInput: NexusGenInputs['GetUserByIdInput']
}): Promise<NexusGenObjects['ReturnMessageObject'] | any> => {
  try {
    if (!ctx.user._id) {
      throw new GraphQLError('Unauthorized')
    }

    const { userId } = userIdInput

    const user = await User.findById(userId)

    if (!user) {
      throw new GraphQLError('No user found')
    }

    const deletedUser = await User.findByIdAndDelete(userId)
    if (deletedUser)
      return {
        message: 'User successfully Deleted',
        status: 'success',
      }
  } catch (err: any) {
    throw new GraphQLError(err.message)
  }
}
