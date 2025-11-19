import { Router } from 'express'
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
} from '../controllers/customer.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/:storeId', requireStoreAccess, createCustomer)
router.get('/:storeId', requireStoreAccess, getCustomers)
router.get('/:storeId/:id', requireStoreAccess, getCustomer)
router.patch('/:storeId/:id', requireStoreAccess, updateCustomer)

export default router
