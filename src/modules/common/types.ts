import { objectType } from 'nexus'

export const ReturnMessageObjectType = objectType({
  name: 'ReturnMessageObject',
  definition(t) {
    t.string('message')
    t.string('status')
  },
})

export const PaginatorObjectType = objectType({
  name: 'PaginatorObject',
  definition(t) {
    t.nullable.float('totalRecords')
    t.nullable.float('currentPage')
    t.nullable.float('pages')
    t.nullable.boolean('hasNextPage')
    t.nullable.float('pageSize')
  },
})
