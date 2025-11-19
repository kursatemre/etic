import { Request, Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { CreateCustomerSchema } from '@etic/types'
import { AppError } from '../middleware/error-handler'
import { AuthRequest } from '../middleware/auth'

export const createCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const data = CreateCustomerSchema.parse(req.body)

    const customer = await prisma.customer.create({
      data: {
        storeId: storeId!,
        ...data,
      },
    })

    res.status(201).json({
      success: true,
      data: customer,
    })
  } catch (error) {
    next(error)
  }
}

export const getCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const { page = '1', limit = '20', search } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      storeId: storeId!,
    }

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          _count: {
            select: {
              orders: true,
              addresses: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.customer.count({ where }),
    ])

    res.json({
      success: true,
      data: customers,
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

export const getCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        storeId: storeId!,
      },
      include: {
        addresses: true,
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!customer) {
      throw new AppError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND')
    }

    res.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params
    const data = CreateCustomerSchema.partial().parse(req.body)

    const customer = await prisma.customer.update({
      where: {
        id,
        storeId: storeId!,
      },
      data,
    })

    res.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    next(error)
  }
}
