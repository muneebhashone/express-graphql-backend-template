import { Server as IServer } from 'http'
import { IUser } from '../user/model'
import { Server as RealtimeServer } from 'socket.io'
import { IPrivateMessage } from 'src/types'

interface IRealtimeUser extends IUser {
  eventId: string
  socketId: string
}

export const initRealTimeServer = (
  server: IServer
): [RealtimeServer, IRealtimeUser[]] => {
  const io = new RealtimeServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  let activeUsers: IRealtimeUser[] = []

  io.on('connection', (socket) => {
    socket.broadcast.emit(
      'connected',
      `User is connected with SocketID: ${
        socket.id
      }, Date: ${new Date().toISOString()}`
    )

    socket.on('presence', (data: IRealtimeUser) => {
      const isValidPresence = data._id

      if (!isValidPresence) return

      const isUserAlreadyPresent = activeUsers.find(
        (user) => user._id === data._id
      )

      if (!isUserAlreadyPresent) {
        socket.join(data.eventId)

        activeUsers.push({
          ...data,
          eventId: data.eventId,
          socketId: socket.id,
        })
        socket.broadcast.emit(
          'user:connected',
          `User connected with Socket ID: ${socket.id}, User ID: ${data._id}, Event ID: ${data.eventId}`
        )
      }
    })

    socket.on('message', (data: IPrivateMessage) => {
      const roomId = data.eventId as string
      socket.broadcast.to(roomId).emit('message', data)
    })

    socket.on('disconnect', (data) => {
      const userFind = activeUsers.find((user) => user.socketId === socket.id)
      const usersActive = activeUsers.filter(
        (user) => user.socketId !== socket.id
      )

      activeUsers = usersActive

      socket.broadcast.emit(
        'user:disconnected',
        `User disconnect with Socket ID: ${socket.id}, User: ${JSON.stringify(
          userFind
        )}`
      )
    })
  })

  return [io, activeUsers]
}
