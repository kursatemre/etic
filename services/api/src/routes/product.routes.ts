import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.use(authenticate)

router.post('/', requireStoreAccess, createProduct)
router.get('/', requireStoreAccess, getProducts)
router.get('/:id', requireStoreAccess, getProduct)
router.patch('/:id', requireStoreAccess, updateProduct)
router.delete('/:id', requireStoreAccess, deleteProduct)

export default router
