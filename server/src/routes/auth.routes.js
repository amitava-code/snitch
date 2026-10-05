import {Router} from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { getMe, login, refresh, register } from '../controllers/auth.controlle.js'
import { authenticate } from '../middleware/auth.middleware.js'


const router = Router()

router.post('/register', registerValidator, register)

router.post('/login', loginValidator,login )

/**
 * @POST /api/auth/refresh
 */
router.post('/refresh', refresh)

/**
 * @GET /api/auth/get-me
 */
router.get('/get-me', authenticate, getMe)

export default router