const express = require('express');
const router = express.Router();
// const productController= require('../controllers/product controller');
// const authCheck=require('../middleware/auth.check')()

const UserController= require('../controller/userContoller');


const fileUploader = require("../helper/fileUpload");

const fileUpload = new fileUploader({
  folderName: "uploads",
  supportedFiles: ["image/png", "image/jpg", "image/jpeg", "image/pdf"],
  fieldSize: 1024 * 1024 * 5,
});


router.get('/hello',function (req,res) {
    try {
        res.send("hello from sourish")
        
    } catch (error) {

        console.log(error)
        
    }
    
});

router.post('/register',fileUpload.upload().single("profilePicture"),UserController.register);
router.post('/login',UserController.signin);
router.get("/getuser/:id",UserController.getUserById);
router.post('/updateuser/:id',fileUpload.upload().single("profilePicture"),UserController.updateUserData)


// router.get('/allitem',productController.allProducts);
// router.post('/add', authCheck.authenticateJWTcheck,productController.addproduct);
// router.get('/itembyid/:id',productController.editProductBYId)
// router.get('/delete/:id',productController.deleteProductById);
// router.put('/edit/:id',productController.editProductBYId)


// router.post('/sharingusedetails',studentcontoller.register);
// router.post('/login',studentcontoller.signin);
// router.get('/myproducts', authCheck.authenticateJWTcheck, productController.getProductsByLoggedInUser);
// router.post('/allproducts',authCheck.authenticateJWTcheck,productController.allproductuserAdded);



module.exports = router;