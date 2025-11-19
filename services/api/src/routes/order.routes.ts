import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/order.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/:storeId', requireStoreAccess, createOrder)
router.get('/:storeId', requireStoreAccess, getOrders)
router.get('/:storeId/:id', requireStoreAccess, getOrder)
router.patch('/:storeId/:id/status', requireStoreAccess, updateOrderStatus)

export default router
