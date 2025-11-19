import { Router } from 'express'
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
} from '../controllers/store.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/', createStore)
router.get('/', getStores)
router.get('/:id', getStore)
router.patch('/:id', updateStore)
router.delete('/:id', deleteStore)

export default router
