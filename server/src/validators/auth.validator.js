import {body, validationResult} from 'express-validator'

export const registerValidator = [
    body('email')
    .exists().withMessage('email is required').bail()
    .isEmail().withMessage('enter valid email')
    .trim(),
    
    body('name')
    .exists().withMessage('name is required').bail()
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ min:2, max:50 }).withMessage('name lenght is fixed'),

    body('password')
    .exists().withMessage('passwordis required').bail()
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({ min:6 }).withMessage('password must be longer than 6 chars'),

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


export const loginValidator = [
    body('email')
    .exists().withMessage('email is required').bail()
    .isEmail().withMessage('enter valid email')
    .trim(),

    body('password')
    .exists().withMessage('password is required').bail()
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({ min:6 }).withMessage('password must be longer than 6 chars'),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid request",
                errors: errors.array()
            })
        }

        next()
    }
]