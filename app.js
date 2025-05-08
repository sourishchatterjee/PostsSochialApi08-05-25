require('dotenv').config()
const express = require('express');
const app = express();
const connectDB = require("./db/db")
const path= require('path')
const router = require('./router/router')
const categoryrouter = require("./router/categoryrouter");
const postrouter= require("./router/postrouter")


 app.use(express.json());
 app.use(express.urlencoded({extends:true}));
 //app.use(express.static(path.join(__dirname,"public")));
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/',router);
app.use('/category',categoryrouter)
app.use("/",postrouter)



const port= process.env.PORT
app.listen(port,function () {
    
    connectDB();
    console.log(`database connected successfuly ${port}`);
})