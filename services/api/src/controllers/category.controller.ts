import { Request, Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { CreateCategorySchema } from '@etic/types'
import { AppError } from '../middleware/error-handler'
import { AuthRequest } from '../middleware/auth'

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const data = CreateCategorySchema.parse(req.body)

    const category = await prisma.category.create({
      data: {
        storeId: storeId!,
        ...data,
      },
      include: {
        parent: true,
        children: true,
      },
    })

    res.status(201).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params

    const categories = await prisma.category.findMany({
      where: {
        storeId: storeId!,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    const category = await prisma.category.findFirst({
      where: {
        id,
        storeId: storeId!,
      },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!category) {
      throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    }

    res.json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params
    const data = CreateCategorySchema.partial().parse(req.body)

    const category = await prisma.category.update({
      where: {
        id,
        storeId: storeId!,
      },
      data,
    })

    res.json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    await prisma.category.delete({
      where: {
        id,
        storeId: storeId!,
      },
    })

    res.json({
      success: true,
      data: { message: 'Category deleted successfully' },
    })
  } catch (error) {
    next(error)
  }
}
