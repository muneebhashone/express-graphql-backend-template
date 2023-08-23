import { idArg, nonNull, extendType, stringArg } from 'nexus'
import { profileById } from './service'
import { OAuth2ObjectType } from './types'

export const OAuth2Query = extendType({
  type: 'Query',
  definition(t) {
    // Job Seekers Find All
    t.nonNull.field('profileById', {
      type: OAuth2ObjectType,
      args: {
        id: nonNull(stringArg()),
      },
      //   @ts-ignore
      async resolve(_, args) {
        const { id } = args
        const data = await profileById(id as string)
        return data
      },
    })
  },
})
