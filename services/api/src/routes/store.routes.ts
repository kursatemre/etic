import { Router } from 'express'
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
} from '../controllers/store.controller'
import { authenticate } from '../middleware/auth'
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'
import orderRoutes from './order.routes'
import customerRoutes from './customer.routes'
import statsRoutes from './stats.routes'

const router = Router()

router.use(authenticate)

router.post('/', createStore)
router.get('/', getStores)
router.get('/:id', getStore)
router.patch('/:id', updateStore)
router.delete('/:id', deleteStore)

// Nested routes
router.use('/:storeId/products', productRoutes)
router.use('/:storeId/categories', categoryRoutes)
router.use('/:storeId/orders', orderRoutes)
router.use('/:storeId/customers', customerRoutes)
router.use('/:storeId/stats', statsRoutes)

export default router
