import { inputObjectType, objectType, interfaceType } from 'nexus'
import { DateTime } from '../scalars'
import { PaginatorObjectType } from '../common/types'

export const UserGeneralNode = interfaceType({
  name: 'UserGeneral',
  definition(t) {
    t.nonNull.id('_id')
    t.nullable.string('firstName')
    t.nullable.string('lastName')
    t.nullable.string('email')
    t.nullable.string('phone')
    t.nullable.string('role')
    t.nullable.dateTime('dob')
    t.nullable.string('country')
    t.nullable.string('city')
    t.nullable.string('state')
    t.nullable.string('zipCode')
    t.nullable.string('address')
    t.nullable.string('avatar')
    t.nullable.string('bio')
    t.nullable.field('createdAt', { type: 'DateTime' })
    t.nullable.field('updatedAt', { type: 'DateTime' })
  },
})

export const UserObjectType = objectType({
  name: 'User',
  definition(t) {
    t.implements(UserGeneralNode)
  },
})

export const UserPaginator = objectType({
  name: 'UserPaginator',
  definition(t) {
    t.nullable.list.nullable.field('data', { type: UserObjectType })
    t.nullable.field('paginatorInfo', { type: PaginatorObjectType })
  },
})

export const LoginObjectType = objectType({
  name: 'LoginObject',
  definition(t) {
    t.nonNull.string('_id')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('token')
    t.boolean('active')
    t.nonNull.string('role')
    t.nonNull.string('email')
  },
})

export const UserList = objectType({
  name: 'Users',
  definition(t) {
    t.nullable.list.nullable.field('data', { type: UserObjectType })
  },
})
