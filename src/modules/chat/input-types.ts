import { inputObjectType, objectType } from 'nexus'

export const ConversationOptionsInputType = inputObjectType({
  name: 'ConversationOptionsInput',
  definition(t) {
    t.string('id')
  },
})

export const ConversationInputType = inputObjectType({
  name: 'ConversationInput',
  definition(t) {
    t.nonNull.list.string('participants')
    t.nonNull.string('eventId')
    // t.nullable.string('image')
  },
})

export const MessageReplyInputType = inputObjectType({
  name: 'MessageReplyInput',
  definition(t) {
    t.string('messageId')
    t.string('firstName')
    t.string('lastName')
    t.string('text')
    t.list.string('pictures')
  },
})

export const MessageInputType = inputObjectType({
  name: 'MessageInput',
  definition(t) {
    t.nonNull.string('messageId')
    t.nonNull.boolean('isPublic')
    t.nullable.string('eventId')
    t.nonNull.string('conversation')
    t.string('sender')
    t.field('replyTo', { type: MessageReplyInputType })
    t.nonNull.string('text')
    t.list.string('pictures')
    t.field('createdAt', { type: 'DateTime' })
    // t.nullable.string('image')
  },
})

export const MessagePublicInputType = inputObjectType({
  name: 'MessagePublicInput',
  definition(t) {
    t.nonNull.string('eventId')
    t.string('sender')
    t.nonNull.string('message')
    t.nonNull.string('conversation')
    t.list.string('pictures')
    // t.nullable.string('image')
  },
})
