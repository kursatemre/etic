import { Request, Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { CreateProductSchema, UpdateProductSchema } from '@etic/types'
import { AppError } from '../middleware/error-handler'
import { AuthRequest } from '../middleware/auth'

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const data = CreateProductSchema.parse(req.body)

    const product = await prisma.product.create({
      data: {
        storeId: storeId!,
        ...data,
        categories: data.categoryIds
          ? {
              create: data.categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        collections: data.collectionIds
          ? {
              create: data.collectionIds.map((collectionId, index) => ({
                collectionId,
                position: index,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        collections: {
          include: {
            collection: true,
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const { page = '1', limit = '20', status, featured, search } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      storeId: storeId!,
    }

    if (status) {
      where.status = status
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { slug: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          _count: {
            select: {
              variants: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      success: true,
      data: products,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        id,
        storeId: storeId!,
      },
      include: {
        variants: true,
        categories: {
          include: {
            category: true,
          },
        },
        collections: {
          include: {
            collection: true,
          },
        },
      },
    })

    if (!product) {
      throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params
    const data = UpdateProductSchema.parse(req.body)

    const product = await prisma.product.update({
      where: {
        id,
        storeId: storeId!,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    })

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    await prisma.product.delete({
      where: {
        id,
        storeId: storeId!,
      },
    })

    res.json({
      success: true,
      data: { message: 'Product deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}
