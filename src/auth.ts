'use strict'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JWTRequest extends Request {
  user?: PayloadToken
}

interface PayloadToken {
  userId?: string
  role?: string
  sub?: string
  username?: string
}

class Auth {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    return Auth.verify(req, res, next)
  }

  static getUser(req: Request): PayloadToken {
    const { user } = req as JWTRequest
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  private static verify(req: JWTRequest, res: Response, next: NextFunction) {
    const token = Auth.getToken(req)
    const secret = process.env.PUBLIC_KEY
    if (!secret) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
      const verifyOptions: jwt.SignOptions = {
        algorithm: 'RS256'
      }

      const secretOrPublicKey = Buffer.from(secret, 'base64')
      const jwtPayload = jwt.verify(token, secretOrPublicKey, verifyOptions)
      const decoded = jwtPayload as PayloadToken
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        sub: decoded.sub,
        username: decoded.username
      }
      next()
    } catch (err) {
        console.log(err)
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }

  static generateToken<T extends PayloadToken>(
    body: T,
    expire?: string | number
  ) {
    const secret = process.env.PRIVATE_KEY
    if (!secret) {
      throw new Error('Internal Server Error')
    }
    const options: jwt.SignOptions = {
      expiresIn: expire ?? '1h',
      algorithm: 'RS256'
    }
    const secretOrPrivateKey = Buffer.from(secret, 'base64')
    const payload: PayloadToken = {
      sub: body?.sub,
      userId: body?.userId,
      role: body?.role,
      username: body?.username
    }

    return jwt.sign(payload, secretOrPrivateKey, options)
  }

  private static getToken(req: Request) {
    try {
      const authHeader = req.header('authorization')
      if (!authHeader) {
        return null
      }
      const [bearer, token] = authHeader.split(' ')
      if (bearer !== 'Bearer') {
        return null
      }
      if (!token) {
        return null
      }
      return token
    } catch (err) {
      return null
    }
  }
}

export default Auth
