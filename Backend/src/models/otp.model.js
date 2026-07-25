import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    opt:{
        type:String,
        required:true,
    },
    purpose:{
        type:String,
        enum:["EMAIL_VERIFICATION","PASSWORD_RESET","LOGIN"],
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
    isUsed:{
        type:Boolean,
        default:false,
    },
    attempts:{
        type:Number,
        default:0,
    }
},{timestamps:true});


otpSchema.index({expiresAt:1},{expireAfterSeconds:0});

export const OTP = mongoose.model("OTP",otpSchema)

