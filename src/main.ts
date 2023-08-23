import * as dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'node:http'
import express, { Response, Request, NextFunction } from 'express'
import { schema } from './schema'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import multer from 'multer'
import passport from 'passport'
import connectToDatabase from './lib/connectToDatabase'
import process from 'node:process'
import path from 'node:path'
import morgan from 'morgan'
import cors from 'cors'
import { LinkedinStrategyVerification } from './modules/oauth2/strategies'

import { decode } from './utils/jwt.utils'
import { createYoga } from 'graphql-yoga'

import { execute, parse, specifiedRules, subscribe, validate } from 'graphql'
import { useEngine } from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'

import { initRealTimeServer } from './modules/chat/init-realtime'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`)
  },
})

const upload = multer({ storage: storage })

const boostrapServer = async () => {
  const app = express()
  const server = createServer(app)

  const [io, activeUsers] = initRealTimeServer(server)

  await connectToDatabase()

  app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))

  app.use(morgan('dev'))

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(compression())

  app.use('/static', express.static(`./public/`))

  app.post('/api/upload_files', upload.array('files'), function (req, res) {
    res.json({ files: req.files })
  })

  app.get('/api/active-users/:eventId', async (req: Request, res: Response) => {
    const eventId = req.params.eventId

    res.json(activeUsers.filter((user) => user.eventId === eventId))
  })

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return next()
    try {
      const token = req.headers.authorization.split(' ')[1]

      const verifyToken = decode(token)

      // @ts-ignore
      req.user = verifyToken
    } catch (err) {
      // @ts-ignore
      console.log(err.message)
    } finally {
      next()
    }
  })

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
  }

  // const graphQLServer = new ApolloServer({
  //   schema: schema,
  //   plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
  // })
  const graphQLServer = createYoga({
    schema,
    // @ts-ignore
    context: async ({ req }) => {
      return { user: req.user, io: io }
    },
    plugins: [
      useEngine({ parse, validate, specifiedRules, execute, subscribe }),
      useGraphQlJit(),
    ],
  })

  // await graphQLServer.start()

  app.use(
    '/api/graphql',
    graphQLServer
    // expressMiddleware(graphQLServer, {
    // context: async ({ req }) => {
    //   return { user: req.user }
    // },
    // })
  )

  app.use(passport.initialize())

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (obj: any, cb) {
    cb(null, obj)
  })

  passport.use(LinkedinStrategyVerification)

  app.get(
    '/auth/linkedin',
    passport.authenticate('linkedin', {
      scope: ['r_emailaddress', 'r_liteprofile'],
    })
  )

  app.get(
    '/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      session: false,
    }),
    (req, res) => {
      console.log({ user: req.user })

      // @ts-ignore
      if (req.user.newProfile) {
        return res.redirect(
          // @ts-ignore
          `${process.env.LINKEDIN_NEW_PROFILE_REDIRECT}?id=${req.user.profile.id}`
        )
      }
      return res.redirect(
        // @ts-ignore
        `${process.env.LINKEDIN_OLD_PROFILE_REDIRECT}?id=${req.user.profile.id}`
      )
    }
  )

  server.listen(process.env.PORT, () => {
    console.info(`Server is running on http://localhost:${process.env.PORT}`)
    console.info(
      `GraphQL API: http://localhost:${process.env.PORT}/api/graphql`
    )
    console.info(`RESTful API: http://localhost:${process.env.PORT}/api`)
  })
}

boostrapServer()
