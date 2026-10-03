import {Router} from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js'
import { register } from '../controllers/auth.controlle.js'


const router = Router()

router.post('/register', registerValidator, register)

router.post('/login', loginValidator, )


export default router