import { nonNull, extendType, stringArg, nullable } from 'nexus'
import {
  getPrivateConversations,
  getPrivateMessages,
  getPublicConversation,
  getPublicMessages,
} from './service'
import { ConversationObjectType, MessageObjectType } from './types'
import { ConversationOptionsInputType } from './input-types'

export const ChatQuery = extendType({
  type: 'Query',
  definition(t) {
    // Job Seekers Find All
    t.list.field('getPrivateConversations', {
      type: ConversationObjectType,
      args: {
        options: ConversationOptionsInputType,
      },
      async resolve(_, args, ctx) {
        const conversations = await getPrivateConversations({
          ctx: ctx,
          options: args.options,
        })
        return conversations
      },
    })

    t.field('getPublicConversation', {
      type: ConversationObjectType,
      args: {
        eventId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const conversation = await getPublicConversation({
          eventId: args.eventId,
        })
        return conversation
      },
    })

    t.list.field('getPrivateMessages', {
      type: MessageObjectType,
      args: {
        conversationId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const messages = await getPrivateMessages({
          conversationId: args.conversationId,
          ctx: ctx,
        })
        return messages
      },
    })

    t.list.field('getPublicMessages', {
      type: MessageObjectType,
      args: {
        conversationId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const messages = await getPublicMessages({
          conversationId: args.conversationId,
        })
        return messages
      },
    })
  },
})
