import { Server as IServer } from 'http'
import { Server as RealtimeServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-streams-adapter'
import { createClient } from 'redis'

export const initRealTimeServer = async (
  server: IServer
): Promise<RealtimeServer> => {
  try {
    const redisClient = createClient({ url: process.env.REDIS_URL })

    await redisClient.connect()

    const io = new RealtimeServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket'],
      adapter: createAdapter(redisClient),
    })

    io.on('connection', (socket) => {
      socket.broadcast.emit(
        'connected',
        `User is connected with SocketID: ${
          socket.id
        }, Date: ${new Date().toISOString()}`
      )

      socket.on('test-message', (data) => {
        io.emit('test-message', data)
      })

      socket.on('disconnect', (data) => {
        socket.broadcast.emit(
          'user:disconnected',
          `User disconnect with Socket ID: ${socket.id}, User: ${JSON.stringify(
            data
          )}`
        )
      })
    })

    return io
  } catch (err) {
    throw new Error(err.message)
  }
}
