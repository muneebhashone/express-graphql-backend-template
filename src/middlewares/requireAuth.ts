import { GraphQLError } from 'graphql'
import { RoleType } from 'src/modules/enums'
import { IUser } from 'src/modules/user/model'
import { IContextType } from 'src/types'

export const requireAuth = async (
  ctx: IContextType,
  roles: RoleType[] = []
): Promise<IUser | GraphQLError> => {
  try {
    const user = ctx.user

    if (!user) {
      throw new GraphQLError('Unauthorized')
    }

    if (!roles.length) {
      return user
    }

    const isRoleAuthorized = roles.some((role) => user.role === role)

    if (!isRoleAuthorized) {
      throw new GraphQLError('Role Unauthorized')
    }

    return user
  } catch (err) {
    throw new GraphQLError('Unauthorized')
  }
}
