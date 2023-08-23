import { IContextType } from 'src/types'
import { idArg, nonNull, extendType, nullable } from 'nexus'

import { UserList, UserObjectType, UserPaginator } from './types'
import { getUser, getUserById, getUsers } from './service'
import { GetUserByIdInputType, UserOptionsInputType } from './input-types'
import { PaginatorFilterInputType } from '../common/input-types'
import { NexusGenInputs } from 'nexus-typegen'

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    // Get User profile
    t.nonNull.field('getProfile', {
      type: UserObjectType,
      async resolve(_, args, ctx: IContextType) {
        const data = await getUser(ctx)
        return data
      },
    })
    t.field('getUsers', {
      type: UserPaginator,
      args: {
        options: nullable(UserOptionsInputType),
        paginator: nullable(PaginatorFilterInputType),
      },
      async resolve(_, args, ctx: IContextType) {
        const data = await getUsers(
          ctx,
          args.options as NexusGenInputs['UserOptionsInput'],
          args.paginator as NexusGenInputs['PaginatorFilterInput']
        )
        return data
      },
    })
    t.nullable.field('getUserById', {
      type: UserObjectType,
      args: {
        data: GetUserByIdInputType,
      },
      async resolve(_, args, ctx) {
        const { data } = args
        return await getUserById(
          ctx,
          data as NexusGenInputs['GetUserByIdInput']
        )
      },
    })
  },
})
