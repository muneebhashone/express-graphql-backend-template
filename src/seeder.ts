import * as dotenv from 'dotenv'
dotenv.config()

import connectToDatabase from './lib/connectToDatabase'
import Conversation, { IConversation } from './modules/chat/conversation.model'
import Message, { IMessage } from './modules/chat/message.model'

async function main() {
  await connectToDatabase()
}

main().then(() => {
  console.info('Data seeded')
  process.exit(1)
})
