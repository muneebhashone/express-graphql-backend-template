import { GraphQLError } from 'graphql'
import { NexusGenObjects } from 'nexus-typegen'
import OAuth2 from './model'

export const profileById = async (
  id: string
): Promise<NexusGenObjects['OAuth2'] | null | undefined> => {
  const profile = await OAuth2.findOne({ 'profile.id': id })

  if (!profile) {
    throw new GraphQLError('Profile not found')
  }

  return profile
}
