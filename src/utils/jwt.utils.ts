import jwt from 'jsonwebtoken'

export function signJwt(payload: any) {
  console.log(payload)
  return jwt.sign(payload, process.env.JWT_SECRET)
}

export function decode(token: string) {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return decoded
  } catch (error) {
    console.error(`error`, error)
    return null
  }
}
