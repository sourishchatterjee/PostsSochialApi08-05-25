const  mongoose  = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
       },
    content: {
        type: String, 
        required: true 
       },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category' 
    },
    tags:{
        type: [String], 
       },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    
  }, 
  {
     versionKey:false,
     timestamps: true
  });
  
module.exports= mongoose.model("post",postSchema)