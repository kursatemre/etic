import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/:storeId', requireStoreAccess, createProduct)
router.get('/:storeId', requireStoreAccess, getProducts)
router.get('/:storeId/:id', requireStoreAccess, getProduct)
router.patch('/:storeId/:id', requireStoreAccess, updateProduct)
router.delete('/:storeId/:id', requireStoreAccess, deleteProduct)

export default router
