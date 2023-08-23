import mongoose, { Types, Model } from 'mongoose'

export interface IProfile {
  provider: string
  id: string
  displayName: string
  photo: string
  email: string
}

export interface IOAuth2 {
  _id: string
  token?: string
  refreshToken?: string
  profile: IProfile
}

interface IOAuth2Document extends IOAuth2, Document {}

interface IOAuth2Model extends Model<IOAuth2Document> {}

const OAuth2Schema = new mongoose.Schema<IOAuth2Document, IOAuth2Model>(
  {
    profile: {
      provider: { type: String },
      id: { type: String, unique: true },
      displayName: { type: String },
      photo: { type: String },
      email: { type: String },
    },
    token: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
)

const OAuth2 = mongoose.model<IOAuth2Document, IOAuth2Model>(
  'OAuth2',
  OAuth2Schema
)

export default OAuth2
