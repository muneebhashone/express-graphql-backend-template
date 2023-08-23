import { GraphQLError } from 'graphql'
import { NexusGenInputs } from './../../../nexus-typegen'
import { idArg, mutationType, nonNull, stringArg } from 'nexus'
import {
  registerUser,
  loginUser,
  updateUser,
  updatePassword,
  forgetPassword,
  changePassword,
  getUserById,
  updateUserById,
  addNewUser,
  setPassword,
} from './service'
import {
  AddNewUserInputType,
  ChangePasswordInputType,
  ForgetPasswordInputType,
  GetUserByIdInputType,
  LoginInputType,
  SetTestPasswordInputType,
  UpdatePasswordInputType,
  UserOptionsInputType,
  UserRegistrationInputType,
  UserUpdateInputType,
} from './input-types'
import { LoginObjectType, UserObjectType, UserPaginator } from './types'
import { ReturnMessageObjectType } from '../common/types'

export const UserMutation = mutationType({
  definition(t) {
    // Register Job Seeker
    t.nullable.field('registerUser', {
      type: UserObjectType,
      args: {
        data: UserRegistrationInputType,
      },
      resolve(_, args) {
        // @ts-ignore
        const { data } = args

        return registerUser(data as NexusGenInputs['UserRegistrationInput'])
      },
    })

    // Login
    t.nullable.field('login', {
      type: LoginObjectType,
      args: {
        data: LoginInputType,
      },
      resolve(_, args) {
        // @ts-ignore
        const { data } = args

        return loginUser(data as NexusGenInputs['LoginInput'])
      },
    })

    t.nullable.field('updateUser', {
      type: UserObjectType,
      args: {
        data: UserUpdateInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        const updatedUser = await updateUser({
          payload: data as NexusGenInputs['UserUpdateInput'],
          ctx,
        })
        return updatedUser
      },
    })

    t.field('setTestPassword', {
      type: ReturnMessageObjectType,
      args: {
        data: SetTestPasswordInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        const updatedPassword = await setPassword({ payload: data })
        return updatedPassword
      },
    })

    t.nullable.field('updatePassword', {
      type: ReturnMessageObjectType,
      args: {
        data: UpdatePasswordInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        const updatedUser = await updatePassword(
          data as NexusGenInputs['UpdatePasswordInput'],
          ctx
        )
        return updatedUser
      },
    })

    t.nullable.field('forgetPassword', {
      type: ReturnMessageObjectType,
      args: {
        data: ForgetPasswordInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        const updatedUser = await forgetPassword(
          data as NexusGenInputs['ForgetPasswordInput']
        )
        return updatedUser
      },
    })

    t.nullable.field('changePassword', {
      type: UserObjectType,
      args: {
        data: ChangePasswordInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        return await changePassword(
          data as NexusGenInputs['ChangePasswordInput']
        )
      },
    })

    t.nullable.field('updateUserById', {
      type: UserObjectType,
      args: {
        data: UserUpdateInputType,
        userId: GetUserByIdInputType,
      },
      async resolve(_, args, ctx) {
        const { data, userId } = args
        return await updateUserById({
          ctx,
          payload: data as NexusGenInputs['UserUpdateInput'],
          userIdInput: userId as NexusGenInputs['GetUserByIdInput'],
        })
      },
    })

    t.nullable.field('addnewUser', {
      type: UserObjectType,
      args: {
        data: AddNewUserInputType,
      },
      resolve(_, args) {
        // @ts-ignore
        const { data } = args

        return addNewUser(data as NexusGenInputs['AddNewUserInput'])
      },
    })
  },
})
