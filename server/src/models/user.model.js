import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required: true
    },
    role:{
        type: String,
        default:"user",
        enum:['user', 'seller']
    }
},{
    timestamps: true
})


const userModel = mongoose.model('user', userSchema)

export default userModel