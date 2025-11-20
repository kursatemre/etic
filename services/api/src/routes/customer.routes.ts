import { Router } from 'express'
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
} from '../controllers/customer.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.use(authenticate)

router.post('/', requireStoreAccess, createCustomer)
router.get('/', requireStoreAccess, getCustomers)
router.get('/:id', requireStoreAccess, getCustomer)
router.patch('/:id', requireStoreAccess, updateCustomer)

export default router
