import {
  ConversationGeneralNode,
  ConversationObjectType,
  MessageGeneralNode,
  MessageObjectType,
} from './types'
import {
  ConversationInputType,
  ConversationOptionsInputType,
  MessageInputType,
  MessagePublicInputType,
} from './input-types'
import { ChatQuery } from './query'
import { ChatMutation } from './mutation'

const Chat = [
  ConversationGeneralNode,
  ConversationObjectType,
  MessageGeneralNode,
  MessageObjectType,
  ConversationInputType,
  ConversationOptionsInputType,
  MessageInputType,
  MessagePublicInputType,
  ChatMutation,
  ChatQuery,
]

export default Chat
