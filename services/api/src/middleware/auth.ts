import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AppError } from './error-handler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
  storeId?: string
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED')
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string
      email: string
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, 'Invalid token', 'INVALID_TOKEN'))
    }
    next(error)
  }
}

export const requireStoreAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract store ID from params or body
    const storeId = req.params.storeId || req.body.storeId

    if (!storeId) {
      throw new AppError(400, 'Store ID required', 'STORE_ID_REQUIRED')
    }

    // TODO: Check if user has access to this store via StoreUser table
    // For now, we'll just set the storeId
    req.storeId = storeId
    next()
  } catch (error) {
    next(error)
  }
}
