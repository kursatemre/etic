import { Router } from 'express'
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller'
import { authenticate, requireStoreAccess } from '../middleware/auth'

const router = Router({ mergeParams: true })

router.use(authenticate)

router.post('/', requireStoreAccess, createCategory)
router.get('/', requireStoreAccess, getCategories)
router.get('/:id', requireStoreAccess, getCategory)
router.patch('/:id', requireStoreAccess, updateCategory)
router.delete('/:id', requireStoreAccess, deleteCategory)

export default router
