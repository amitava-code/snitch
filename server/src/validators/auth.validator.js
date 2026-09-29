import {body} from 'express-validator'

export const registerValidator = [
    body('email')
    .tirm()
    .exists().withMessage('email is required')
    .isEmail().withMessage('enter valid email'),

    body('name')
    .tirm()
    .isLength({ min:2, max:50 }).withMessage('name lenght is fixed')
    .exists().withMessage('name is required')
    .isString().withMessage('name must be a string'),

    body('password')
    .trim()
    .isLength({ min:6 }).withMessage('password must be longer than 6 chars')
    .exists().withMessage('passwordis required')
    .isString().withMessage('password must be a string'),

    (req, res, next) =>{
        
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Invalid request",
                errors: errors.array()
            })
        }


        next()
    }

    
]