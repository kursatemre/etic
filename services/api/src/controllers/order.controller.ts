import { Request, Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { CreateOrderSchema } from '@etic/types'
import { AppError } from '../middleware/error-handler'
import { AuthRequest } from '../middleware/auth'

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}${random}`
}

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const data = CreateOrderSchema.parse(req.body)

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal // Add tax and shipping logic later

    const order = await prisma.order.create({
      data: {
        storeId: storeId!,
        customerId: data.customerId,
        orderNumber: generateOrderNumber(),
        email: data.email,
        phone: data.phone,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        currency: data.currency,
        note: data.note,
        subtotal,
        total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            title: item.title,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    })

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params
    const { page = '1', limit = '20', status } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      storeId: storeId!,
    }

    if (status) {
      where.orderStatus = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({ where }),
    ])

    res.json({
      success: true,
      data: orders,
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

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params

    const order = await prisma.order.findFirst({
      where: {
        id,
        storeId: storeId!,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        transactions: true,
      },
    })

    if (!order) {
      throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND')
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId, id } = req.params
    const { orderStatus, paymentStatus, fulfillmentStatus } = req.body

    const order = await prisma.order.update({
      where: {
        id,
        storeId: storeId!,
      },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(fulfillmentStatus && { fulfillmentStatus }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
        customer: true,
      },
    })

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}
