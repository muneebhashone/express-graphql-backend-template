import { inputObjectType } from 'nexus'
import { DateTime } from '../scalars'

export const UserOptionsInputType = inputObjectType({
  name: 'UserOptionsInput',
  definition(t) {
    t.string('q')
    t.field('role', { type: 'ROLE' })
  },
})

export const UserRegistrationInputType = inputObjectType({
  name: 'UserRegistrationInput',

  definition(t) {
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('confirmPassword')
    t.nonNull.boolean('termsAndCondition')
    t.nonNull.field('role', { type: 'ROLE' })
  },
})

export const LoginInputType = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
  },
})

export const UserUpdateInputType = inputObjectType({
  name: 'UserUpdateInput',
  definition(t) {
    t.string('firstName')
    t.string('lastName')
    t.string('email')
    t.dateTime('dob')
    t.string('country')
    t.string('city')
    t.string('state')
    t.string('zipCode')
    t.boolean('active', { default: true })
    t.string('address')
    t.string('avatar')
    t.string('bio')
    t.string('phone')
  },
})

export const UpdatePasswordInputType = inputObjectType({
  name: 'UpdatePasswordInput',
  definition(t) {
    t.nonNull.string('password')
    t.nonNull.string('newPassword')
    t.nonNull.string('confirmPassword')
  },
})

export const ForgetPasswordInputType = inputObjectType({
  name: 'ForgetPasswordInput',
  definition(t) {
    t.nonNull.string('email')
  },
})

export const ChangePasswordInputType = inputObjectType({
  name: 'ChangePasswordInput',
  definition(t) {
    t.nonNull.int('otp')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('confirmPassword')
  },
})

export const GetUserByIdInputType = inputObjectType({
  name: 'GetUserByIdInput',
  definition(t) {
    t.nonNull.string('userId')
  },
})

export const SetTestPasswordInputType = inputObjectType({
  name: 'SetTestPasswordInput',
  definition(t) {
    t.nonNull.string('email')
  },
})

export const AddNewUserInputType = inputObjectType({
  name: 'AddNewUserInput',

  definition(t) {
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('confirmPassword')
    t.nonNull.string('country')
    t.nonNull.string('state')
    t.nonNull.string('city')
    t.nonNull.string('zipCode')
    t.nonNull.string('phone')
    t.nonNull.string('bio')
    t.nonNull.field('role', { type: 'ROLE' })
  },
})
