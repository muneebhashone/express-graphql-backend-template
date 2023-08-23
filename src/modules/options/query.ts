import { extendType } from 'nexus'
import { getTimezones } from './service'
import { OptionsObjectType, TimezoneObjectType } from './types'

export const OptionsQuery = extendType({
  type: 'Query',
  definition(t) {
    // All Timezones Query
    t.nonNull.list.nullable.field('getTimezones', {
      type: TimezoneObjectType,
      // @ts-ignore
      async resolve() {
        const data = await getTimezones()
        return data
      },
    })
  },
})
