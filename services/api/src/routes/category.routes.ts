import { Router } from 'express'
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/:storeId', requireStoreAccess, createCategory)
router.get('/:storeId', requireStoreAccess, getCategories)
router.get('/:storeId/:id', requireStoreAccess, getCategory)
router.patch('/:storeId/:id', requireStoreAccess, updateCategory)
router.delete('/:storeId/:id', requireStoreAccess, deleteCategory)

export default router
