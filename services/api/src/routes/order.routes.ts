import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/order.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.use(authenticate)

router.post('/', requireStoreAccess, createOrder)
router.get('/', requireStoreAccess, getOrders)
router.get('/:id', requireStoreAccess, getOrder)
router.patch('/:id/status', requireStoreAccess, updateOrderStatus)

export default router
