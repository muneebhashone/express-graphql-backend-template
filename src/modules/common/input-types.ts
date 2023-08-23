import { inputObjectType } from 'nexus'

export const PaginatorFilterInputType = inputObjectType({
  name: 'PaginatorFilterInput',
  definition(t) {
    t.int('page', { default: 1 })
    t.int('limit', { default: 10 })
  },
})
