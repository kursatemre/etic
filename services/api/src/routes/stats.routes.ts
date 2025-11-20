import { Router } from 'express'
import * as statsController from '../controllers/stats.controller'
import { authenticate } from '../middleware/auth'

const router = Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

router.get('/', statsController.getStoreStats)

export default router
