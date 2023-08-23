import { objectType } from 'nexus'

export const OptionsObjectType = objectType({
  name: 'Options',
  definition(t) {
    t.nonNull.string('name')
    t.nonNull.string('value')
  },
})

export const TimezoneObjectType = objectType({
  name: 'Timezone',
  definition(t) {
    t.string('value')
    t.string('abbr')
    t.float('offset')
    t.boolean('isdst')
    t.string('text')
    t.list.string('utc')
  },
})
