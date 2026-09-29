import config from '../config/config.js'
import mongoose from 'mongoose'

export async function connectDB(){
    await mongoose.connect(config.MONGO_URI)
    console.log('DB connected successfully')
}

export default connectDB