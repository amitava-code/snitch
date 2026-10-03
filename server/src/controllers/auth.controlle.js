import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken, createRefreshToken } from '../utils/auth.utils.js'

/**
 * @description register an user and save the data from req.body
 * @param req express.request
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.name String
 * @param req.body.password String
 */


export async function register(req, res){

    const { email, name , password} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        email
    })


    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists with this email address",
            errors: [
                {
                    field:"email",
                    message:"user already exists with this email address"
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password, 12)
    })

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id,{
        refreshToken
    })

    res.status(201).json({
        message:"User Registered Successfully",
        data:{
            users: {
                email: user.email,
                name: user.name,
                id: user._id
            },
            accessToken
        }
    })


}

/**
 * @description Login a user and create a new set of AccessToken & RefreshToken
 * @param req.body.email String
 * @param req.body.password String
 */

export async function login(req, res){

    const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"Invvalid email or password "
        })
    }

    const isPassWordValid = await bcrypt.compare(password, user.passwordHash)

    if(!isPassWordValid){
        return res.status(400).json({
            message:"Inavlid eamil or password"
        })
    }

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })

    await userModel.findOneAndUpdate({
        email
    },{
        refreshToken
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

    res.status(200).json({
        message:"User logged in successfully",
        data:{
            user:{
            id: user._id,
            email: user.email,
            name: user.name
            },
            accessToken
        }
    })



}