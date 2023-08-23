import mongoose, { Model, Schema } from 'mongoose'
import { FieldTypes } from '../enums'

export interface IMessage {
  _id: string
  conversation: Schema.Types.ObjectId
  sender: Schema.Types.ObjectId
  isPublic: boolean
  event: Schema.Types.ObjectId
  replyTo?: Schema.Types.ObjectId
  text: string
  messageId: string
  pictures: string[]
  seen: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IMessageDocument extends IMessage, Document {}

export interface IMessageModel extends Model<IMessageDocument> {}

const MessageSchema = new mongoose.Schema<IMessageDocument, IMessageModel>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    isPublic: { type: Boolean, default: false },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    text: { type: String },
    messageId: { type: String },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
    pictures: [{ type: String }],
    seen: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Message = mongoose.model<IMessageDocument, IMessageModel>(
  'Message',
  MessageSchema
)

export default Message
