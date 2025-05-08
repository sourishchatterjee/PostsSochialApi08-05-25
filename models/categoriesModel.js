const  mongoose  = require("mongoose");

const categorySchema = new mongoose.Schema({
   categoryname: {
      type:String,
      required:true,
  },
    description: {
      type:String,
      required:true,
  },
  }, { 
    versionKey:false,
    timestamps: true 
    });

module.exports= mongoose.model("category",categorySchema)
  