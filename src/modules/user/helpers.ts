import { GraphQLError } from 'graphql'
import User from './model'

export const checkIfUserAlreadyExist = async (email: string) => {
  const isExist = await User.findOne({ email: email })

  if (isExist) {
    throw new GraphQLError('User already exist with a same email address')
  }

  return true
}

export default function convertUsdToCents(amount: number) {
  return Math.round(amount * 100)
}
