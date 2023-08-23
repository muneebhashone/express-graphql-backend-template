import { extendType, stringArg, nonNull } from 'nexus'
import {
  sendMessagePrivate,
  createConversation,
  sendMessagePublic,
  sendMessage,
  seenMessage,
} from './service'
import { MessageObjectType, ConversationObjectType } from './types'
import {
  ConversationInputType,
  MessageInputType,
  MessagePublicInputType,
} from './input-types'

export const ChatMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('sendMessagePrivate', {
      type: MessageObjectType,
      // @ts-ignore
      args: { data: MessageInputType },
      async resolve(_, args, ctx) {
        return sendMessagePrivate({ ctx: ctx, payload: args.data })
      },
    })

    t.nonNull.field('sendMessage', {
      type: MessageObjectType,
      // @ts-ignore
      args: { data: MessageInputType },
      async resolve(_, args, ctx) {
        return sendMessage({ ctx: ctx, payload: args.data })
      },
    })

    t.nonNull.field('sendMessagePublic', {
      type: MessageObjectType,
      // @ts-ignore
      args: { data: MessagePublicInputType },
      async resolve(_, args, ctx) {
        return sendMessagePublic({ ctx: ctx, payload: args.data })
      },
    })

    t.nonNull.field('createConversation', {
      type: ConversationObjectType,
      // @ts-ignore
      args: { data: ConversationInputType },
      async resolve(_, args, ctx) {
        return createConversation({ ctx: ctx, payload: args.data })
      },
    })

    t.nullable.field('seenMessage', {
      type: MessageObjectType,
      // @ts-ignore
      args: { messageId: nonNull(stringArg()) },
      async resolve(_, args, ctx) {
        return seenMessage({ ctx: ctx, payload: args.messageId })
      },
    })
  },
})
