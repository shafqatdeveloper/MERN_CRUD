import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
})

const user = mongoose.model('userschema',userSchema)
export default user;