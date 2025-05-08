const express = require('express');
const categoryrouter = express.Router();
const categorieController= require("../controller/categoryController");
const authCheck=require('../middleware/auth.check')()



categoryrouter.get('/hello',function (req,res) {
    try {
        res.send("hello from sourish")
        
    } catch (error) {

        console.log(error)
        
    }
    
});
categoryrouter.post("/addcategory",authCheck.authenticateJWTcheck,categorieController.addcategory);

categoryrouter.get("/getcategorydetails",authCheck.authenticateJWTcheck,categorieController.getAllCategoryWithPostDetails);
//getAllCategoryWithPostDetails


module.exports = categoryrouter;