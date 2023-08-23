import { objectType, interfaceType } from 'nexus'
import { PaginatorObjectType } from '../common/types'

export const ConversationGeneralNode = interfaceType({
  name: 'ConversationGeneral',
  definition(t) {
    t.string('_id')
    t.list.field('participants', { type: 'User' })
    t.string('event')
    t.nullable.string('lastMessage')
    t.boolean('isPublic')
    t.boolean('seen')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
  // @ts-ignore
  resolveType: undefined,
})

export const ConversationObjectType = objectType({
  name: 'ConversationObject',
  definition(t) {
    t.implements(ConversationGeneralNode)
  },
})

export const MessageGeneralNode = interfaceType({
  name: 'MessageGeneral',
  definition(t) {
    t.nonNull.id('_id')
    t.string('conversation')
    t.string('event')
    t.field('sender', { type: 'User' })
    t.boolean('isPublic')
    t.string('text')
    t.string('messageId')
    t.list.string('pictures')
    t.boolean('seen')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
  // @ts-ignore
  resolveType: undefined,
})

export const MessageObjectType = objectType({
  name: 'MessageObject',
  definition(t) {
    t.implements(MessageGeneralNode)
    t.field('replyTo', { type: 'MessageGeneral' })
  },
})
