const  mongoose  = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post' 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    content: {
        type:String,
        required:true,
    },
  }, { 
    versionKey:false,
    timestamps: true, 
});
  

module.exports= mongoose.model("comment",commentSchema);