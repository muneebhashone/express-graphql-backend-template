import { Request, Response } from 'express'
import { Server } from 'socket.io'

export const requireContext = (io: Server) => {
  return (req: Request, res: Response, next: any) => {
    const ctx = {
      user: req.user,
      io: io,
    }

    res.locals.ctx = ctx
    next()
  }
}
