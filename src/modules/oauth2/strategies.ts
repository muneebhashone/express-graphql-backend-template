import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import User from '../user/model'
import OAuth2 from './model'

export const LinkedinStrategyVerification = new LinkedInStrategy(
  {
    clientID: process.env.LINKEDIN_CLIENT_ID as string,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL as string,
    scope: ['r_emailaddress', 'r_liteprofile'],
  },
  async function (token, tokenSecret, profile, done) {
    let profileLinkedin
    let userLinkedin

    profileLinkedin = await OAuth2.findOne({ 'profile.id': profile.id })
    userLinkedin = await User.findOne({ linkedinProfileId: profile.id })

    if (profileLinkedin && !userLinkedin) {
      profileLinkedin = { ...profileLinkedin.toObject(), newProfile: true }

      return done(null, profileLinkedin)
    }

    if (profileLinkedin && userLinkedin) {
      profileLinkedin = { ...profileLinkedin.toObject(), newProfile: false }

      return done(null, profileLinkedin)
    }

    if (!profileLinkedin) {
      profileLinkedin = await OAuth2.create({
        token,
        profile: {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[profile.photos.length - 1].value,
          provider: profile.provider,
        },
        refreshToken: tokenSecret,
      })

      profileLinkedin = { ...profileLinkedin.toObject(), newProfile: true }

      return done(null, profileLinkedin)
    }

    // @ts-ignore
    profileLinkedin = { ...profileLinkedin.toObject(), newProfile: false }

    return done(null, profileLinkedin)
  }
)
