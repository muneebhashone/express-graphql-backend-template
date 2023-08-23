import { enumType } from 'nexus'

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const

export type GenderType = keyof typeof Gender

export const GENDER = enumType({
  name: 'GENDER',
  members: Gender,
})

export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

export type RoleType = keyof typeof Role

export const ROLE = enumType({
  name: 'ROLE',
  members: Role,
})

const Enums = [GENDER, ROLE]

export default Enums
