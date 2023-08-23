import { Server } from 'socket.io'
import { IUser } from './modules/user/model'
import { NexusGenInputNames, NexusGenInputs } from 'nexus-typegen'

export interface IContextType {
  user: IUser
  io: Server
}

export type IPrivateMessage = NexusGenInputs['MessageInput']

export type IPublicMessage = NexusGenInputs['MessagePublicInput']
