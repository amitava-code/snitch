import {Router} from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { login, refresh, register } from '../controllers/auth.controlle.js'


const router = Router()

router.post('/register', registerValidator, register)

router.post('/login', loginValidator,login )

/**
 * @POST /api/auth/refresh
 */
router.post('/refresh', refresh)


export default router