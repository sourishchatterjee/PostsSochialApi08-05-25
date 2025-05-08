const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
         type: String, 
         unique: true 
        },
    password: {
        type:String,
        required:true,
    },
   
    bio: {
        type:String,
        required:true,
    },
    profilePicture: {
        type: String,  
        required: false
      },
    emailVerified: {
         type: Boolean, 
         default: false 
        },
        isDeleted: { 
            type: Boolean,
            default: false,
        },
  }, { 
    versionKey:false,
    timestamps: true,
 });


 module.exports= mongoose.model("user",userSchema)
  