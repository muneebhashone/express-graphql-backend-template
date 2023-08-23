import mongoose, { Model, Schema } from 'mongoose'
import { FieldTypes } from '../enums'

export interface IConversation {
  _id: string
  participants: mongoose.Schema.Types.ObjectId[]
  isPublic: boolean
  seen: boolean
  lastMessage: string
  event: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IConversationDocument extends IConversation, Document {}

export interface IConversationModel extends Model<IConversationDocument> {}

const ConversationSchema = new mongoose.Schema<
  IConversationDocument,
  IConversationModel
>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: { type: Boolean },
    lastMessage: { type: String },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    seen: { type: Boolean },
  },
  { timestamps: true }
)

const Conversation = mongoose.model<IConversationDocument, IConversationModel>(
  'Conversation',
  ConversationSchema
)

export default Conversation
