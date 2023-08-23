import { GraphQLError, graphql } from 'graphql'
import Conversation, { IConversationDocument } from './conversation.model'
import Message, { IMessageDocument } from './message.model'
import User, { IUserDocument } from '../user/model'
import { NexusGenInputs, NexusGenObjects } from 'nexus-typegen'
import { IContextType, IPrivateMessage, IPublicMessage } from 'src/types'
import mailer from '../../lib/mailer'
import { FilterQuery } from 'mongoose'
import { getPaginator, objectSanitizer } from '../../utils/common.utils'
import { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

export const getPrivateConversations = async ({
  ctx,
  options,
}: {
  ctx: IContextType
  options: NexusGenInputs['ConversationOptionsInput']
}): Promise<NexusGenObjects['ConversationObject'][]> => {
  const user = ctx?.user

  if (!user?._id) {
    throw new Error('Unauthorized')
  }

  const filter: FilterQuery<IConversationDocument> = {
    participants: user._id,
  }

  const conversations = await Conversation.find(objectSanitizer(filter))
    .sort({
      createdAt: -1,
    })
    .populate('participants')

  return conversations.map((conversation) => {
    const participants = conversation.participants.filter((participant) => {
      return participant._id.toString() !== user._id
    })

    return { ...conversation.toObject(), participants: participants }
  })
}

export const getPrivateMessages = async ({
  ctx,
  conversationId,
}: {
  ctx: IContextType
  conversationId: string
}): Promise<NexusGenObjects['MessageObject'][]> => {
  const messages = await Message.find({
    conversation: conversationId,
  }).populate('sender')

  return messages
}

export const getPublicMessages = async ({
  conversationId,
}: {
  conversationId: string
}): Promise<NexusGenObjects['MessageObject'][]> => {
  const publicMessages = await Message.find({
    conversation: conversationId,
    isPublic: true,
  }).populate('sender')

  return publicMessages || []
}

export const getPublicConversation = async ({
  eventId,
}: {
  eventId: string
}): Promise<NexusGenObjects['ConversationObject']> => {
  let conversation = await Conversation.findOne({
    event: eventId,
    isPublic: true,
  })

  if (!conversation) {
    conversation = await Conversation.create({ event: eventId, isPublic: true })
  }

  console.log({ conversation })

  return conversation.toObject()
}

export const sendMessage = async ({
  ctx,
  payload,
}: {
  ctx: IContextType
  payload: NexusGenInputs['MessageInput']
}): Promise<NexusGenObjects['MessageObject']> => {
  try {
    const from = ctx.user._id

    const message: IPrivateMessage = {
      messageId: payload.messageId,
      eventId: payload.eventId,
      isPublic: payload.isPublic ? true : false,
      sender: from,
      text: payload.text,
      pictures: payload.pictures,
      conversation: payload.conversation,
      createdAt: payload.createdAt,
      replyTo: payload.replyTo.messageId,
    }

    ctx.io.emit('message', {
      ...message,
      sender: ctx.user,
    })

    const messageSaved = await Message.create({
      ...message,
      event: message.eventId,
    })

    const updateConversation = await Conversation.updateOne(
      { _id: payload.conversation },
      {
        lastMessage: payload.text,
      }
    )

    return messageSaved.toObject()
  } catch (err) {
    console.log({ err })
  }
}

export const createConversation = async ({
  payload,
  type = 'private',
  ctx,
}: {
  type: 'private' | 'public'
  payload: NexusGenInputs['ConversationInput']
  ctx: IContextType
}): Promise<NexusGenObjects['ConversationObject']> => {
  if (payload.participants.length < 2) {
    throw new GraphQLError('Participants must be 2 or more')
  }

  const participantsSorted = payload.participants.sort()

  let conversation = await Conversation.findOne({
    participants: participantsSorted,
    event: payload.eventId,
  })

  if (!conversation) {
    const conversationComposed = {
      participants: type === 'private' ? participantsSorted : [],
      isPublic: type !== 'private',
      event: payload.eventId,
    }

    conversation = await Conversation.create(conversationComposed)
  }

  const participants = await User.find({
    _id: { $in: conversation.participants },
  })

  return {
    ...conversation.toObject(),
    participants: participants.filter(
      (user) => user._id.toString() !== ctx.user._id
    ),
  }
}

export const seenMessage = async ({
  payload,
  ctx,
}: {
  payload: { messageId: string }
  ctx: IContextType
}) => {
  try {
    const user = ctx.user

    const message = await Message.findOneAndUpdate(
      { messageId: payload.messageId },
      { $set: { seen: user._id } }
    )

    if (message) {
      ctx.io.emit('message', message)
    }

    return message?.toObject()
  } catch (err) {
    throw new GraphQLError(err.message || 'Some error occured')
  }
}
