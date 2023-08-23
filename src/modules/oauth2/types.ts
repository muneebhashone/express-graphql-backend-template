import { objectType } from 'nexus'

export const OAuth2ProfileObjectType = objectType({
  name: 'OAuth2Profile',
  definition(t) {
    t.nullable.string('provider')
    t.nullable.string('id')
    t.nullable.string('displayName')
    t.nullable.string('photo')
    t.nullable.string('email')
  },
})

export const OAuth2ObjectType = objectType({
  name: 'OAuth2',
  definition(t) {
    t.nullable.field('profile', { type: OAuth2ProfileObjectType })
    // t.nullable.string('token')
    // t.nullable.string('refreshToken')
  },
})
