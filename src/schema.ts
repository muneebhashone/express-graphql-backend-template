import { makeSchema } from 'nexus'
import { join } from 'path'
import Enums from './modules/enums'
import Scalars from './modules/scalars'
import Users from './modules/user'
import Options from './modules/options'
import Common from './modules/common'
import Chat from './modules/chat'

export const schema = makeSchema({
  features: {
    abstractTypeStrategies: {
      resolveType: false,
    },
  },
  types: [Enums, Scalars, Users, Options, Common, Chat],
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
  },
})
