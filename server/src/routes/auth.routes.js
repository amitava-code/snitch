import {Router} from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { login, register } from '../controllers/auth.controlle.js'


const router = Router()

router.post('/register', registerValidator, register)

router.post('/login', loginValidator,login )


export default router