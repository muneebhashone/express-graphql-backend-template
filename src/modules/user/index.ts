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
]

export default Users
