import { Response, NextFunction } from 'express'
import { prisma } from '@etic/database'
import { AuthRequest } from '../middleware/auth'

export const getStoreStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { storeId } = req.params

    // Get counts
    const [totalProducts, totalOrders, totalCustomers, activeProducts] = await Promise.all([
      prisma.product.count({
        where: { storeId: storeId! },
      }),
      prisma.order.count({
        where: { storeId: storeId! },
      }),
      prisma.customer.count({
        where: { storeId: storeId! },
      }),
      prisma.product.count({
        where: {
          storeId: storeId!,
          status: 'ACTIVE',
        },
      }),
    ])

    // Get total sales (sum of all paid orders)
    const totalSalesData = await prisma.order.aggregate({
      where: {
        storeId: storeId!,
        paymentStatus: {
          in: ['PAID', 'PARTIALLY_PAID'],
        },
      },
      _sum: {
        total: true,
      },
    })

    const totalSales = totalSalesData._sum.total || 0

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { storeId: storeId! },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Get top products by quantity sold
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          storeId: storeId!,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    // Get product details for top products
    const topProductIds = topProducts.map((p) => p.productId)
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds,
        },
      },
    })

    const topProductsWithDetails = topProducts.map((item) => {
      const product = productDetails.find((p) => p.id === item.productId)
      return {
        product,
        quantitySold: item._sum.quantity || 0,
      }
    })

    res.json({
      success: true,
      data: {
        stats: {
          totalSales: Number(totalSales),
          totalOrders,
          totalCustomers,
          totalProducts,
          activeProducts,
        },
        recentOrders,
        topProducts: topProductsWithDetails,
      },
    })
  } catch (error) {
    next(error)
  }
}
