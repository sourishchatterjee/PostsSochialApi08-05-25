const mongoose= require('mongoose');


const connectDB= async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL);
       console.log("your dbConnected successfully");
       
    } catch (error) {
        console.log("unable to connect DB",error);
        
    }
}

module.exports = connectDB ;