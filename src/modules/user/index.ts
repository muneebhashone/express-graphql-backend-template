import { UserMutation } from './mutation'
import { UserQuery } from './query'
import {
  UserGeneralNode,
  LoginObjectType,
  UserObjectType,
  UserPaginator,
  UserList,
} from './types'
import {
  LoginInputType,
  SetTestPasswordInputType,
  UserOptionsInputType,
  UserRegistrationInputType,
  UserUpdateInputType,
  UpdatePasswordInputType,
  ForgetPasswordInputType,
  ChangePasswordInputType,
  GetUserByIdInputType,
  AddNewUserInputType,
  EmailVerificationInputType,
} from './input-types'

const Users = [
  UserObjectType,
  LoginObjectType,
  UserPaginator,
  UserGeneralNode,
  SetTestPasswordInputType,
  UserQuery,
  UserMutation,
  LoginInputType,
  UserOptionsInputType,
  UserRegistrationInputType,
  UserUpdateInputType,
  ForgetPasswordInputType,
  ChangePasswordInputType,
  UpdatePasswordInputType,
  GetUserByIdInputType,
  AddNewUserInputType,
  UserList,
  EmailVerificationInputType,
]

export default Users
