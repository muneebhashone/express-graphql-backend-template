import { Request, Response, Router } from 'express'
import {
  addNewUser,
  changePassword,
  deleteUserById,
  forgetPassword,
  getUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateUserById,
  verifyEmail,
} from './service'
import asyncHandler from 'express-async-handler'
import { NexusGenEnums, NexusGenInputs, NexusGenObjects } from 'nexus-typegen'

const router = Router()

router.get(
  '/profile',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['User'] | any> => {
      const data = await getUser(res.locals.ctx)
      return res.json(data)
    }
  )
)

router.get(
  '/',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['Users'] | any> => {
      const { q, role, page, limit } = req.query
      const options: NexusGenInputs['UserOptionsInput'] = {
        q: q as string,
        role: role as NexusGenEnums['ROLE'],
      }
      const paginator: NexusGenInputs['PaginatorFilterInput'] = {
        limit: Number(limit),
        page: Number(page),
      }
      const { data, count } = await getUsers(res.locals.ctx, options, paginator)
      return res.json(data)
    }
  )
)

router.get(
  '/:id',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['User'] | any> => {
      const payload: NexusGenInputs['GetUserByIdInput'] = {
        userId: req.params.id,
      }
      const data = await getUserById(res.locals.ctx, payload)
      return res.json(data)
    }
  )
)

router.post(
  '/register',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['User'] | any> => {
      const payload: NexusGenInputs['UserRegistrationInput'] = req.body

      const data = await registerUser(payload)
      return res.json(data)
    }
  )
)

router.post(
  '/login',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['LoginObject'] | any> => {
      const payload: NexusGenInputs['LoginInput'] = req.body

      const data = await loginUser(payload)
      return res.json(data)
    }
  )
)

router.post(
  '/forgetPassword',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['ReturnMessageObject'] | any> => {
      const payload: NexusGenInputs['ForgetPasswordInput'] = req.body

      const data = await forgetPassword(payload)
      return res.json(data)
    }
  )
)

router.post(
  '/resetPassword',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['User'] | any> => {
      const payload: NexusGenInputs['ChangePasswordInput'] = req.body

      const data = await changePassword(payload)
      return res.json(data)
    }
  )
)

router.post(
  '/verifyEmail',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['ReturnMessageObject'] | any> => {
      const payload: NexusGenInputs['EmailVerificationInputType'] = req.body

      const data = await verifyEmail(payload)
      return res.json(data)
    }
  )
)

router.patch(
  '/:id',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['User'] | any> => {
      const id = req.params.id
      const payload: NexusGenInputs['UserUpdateInput'] = req.body
      const ctx = res.locals?.ctx

      const data = await updateUserById({
        ctx,
        payload: payload as NexusGenInputs['UserUpdateInput'],
        userIdInput: { userId: id } as NexusGenInputs['GetUserByIdInput'],
      })
      return res.json(data)
    }
  )
)

router.post(
  '/addNewUser',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['ReturnMessageObject'] | any> => {
      const payload = req.body

      const data = await addNewUser(
        payload as NexusGenInputs['AddNewUserInput']
      )
      return res.json(data)
    }
  )
)

router.delete(
  '/:id',
  asyncHandler(
    async (
      req: Request,
      res: Response
    ): Promise<NexusGenObjects['ReturnMessageObject'] | any> => {
      const { id } = req.params
      const ctx = res.locals.ctx

      const data = await deleteUserById({
        ctx,
        userIdInput: { userId: id } as NexusGenInputs['GetUserByIdInput'],
      })
      return res.json(data)
    }
  )
)

const UserRouter = router

export default UserRouter
