import { Request, Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { CreateStoreSchema, UpdateStoreSchema } from '@etic/types'
import { AppError } from '../middleware/error-handler'
import { AuthRequest } from '../middleware/auth'

export const createStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = CreateStoreSchema.parse(req.body)

    // Check if slug is available
    const existingStore = await prisma.store.findUnique({
      where: { slug: data.slug },
    })

    if (existingStore) {
      throw new AppError(409, 'Store slug already taken', 'SLUG_TAKEN')
    }

    // Create store and assign user as owner
    const store = await prisma.store.create({
      data: {
        ...data,
        users: {
          create: {
            userId: req.user!.id,
            role: 'OWNER',
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      data: store,
    })
  } catch (error) {
    next(error)
  }
}

export const getStores = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stores = await prisma.store.findMany({
      where: {
        users: {
          some: {
            userId: req.user!.id,
          },
        },
      },
      include: {
        users: {
          where: {
            userId: req.user!.id,
          },
          select: {
            role: true,
          },
        },
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
          },
        },
      },
    })

    res.json({
      success: true,
      data: stores,
    })
  } catch (error) {
    next(error)
  }
}

export const getStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const store = await prisma.store.findFirst({
      where: {
        id,
        users: {
          some: {
            userId: req.user!.id,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
            orders: true,
            customers: true,
            categories: true,
          },
        },
      },
    })

    if (!store) {
      throw new AppError(404, 'Store not found', 'STORE_NOT_FOUND')
    }

    res.json({
      success: true,
      data: store,
    })
  } catch (error) {
    next(error)
  }
}

export const updateStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const data = UpdateStoreSchema.parse(req.body)

    // Check if user has access to this store
    const storeAccess = await prisma.storeUser.findFirst({
      where: {
        storeId: id,
        userId: req.user!.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    })

    if (!storeAccess) {
      throw new AppError(403, 'Forbidden', 'FORBIDDEN')
    }

    const store = await prisma.store.update({
      where: { id },
      data,
    })

    res.json({
      success: true,
      data: store,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check if user is owner
    const storeAccess = await prisma.storeUser.findFirst({
      where: {
        storeId: id,
        userId: req.user!.id,
        role: 'OWNER',
      },
    })

    if (!storeAccess) {
      throw new AppError(403, 'Only store owner can delete the store', 'FORBIDDEN')
    }

    await prisma.store.delete({
      where: { id },
    })

    res.json({
      success: true,
      data: { message: 'Store deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}
