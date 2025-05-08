const express = require("express");
const postrouter = express.Router();
const postController = require("../controller/postController");
const authCheck = require("../middleware/auth.check")();

postrouter.get("/hello", function (req, res) {
  try {
    res.send("hello from sourish");
  } catch (error) {
    console.log(error);
  }
});
postrouter.post("/addpost", authCheck.authenticateJWTcheck,postController.addPost);
postrouter.get("/getallpost", authCheck.authenticateJWTcheck,postController.getAllPosts);
postrouter.get("/getpost/:id",authCheck.authenticateJWTcheck, postController.getPostById);
postrouter.put("/updatepost/:id",authCheck.authenticateJWTcheck, postController.updatePost);
postrouter.delete("/:id",authCheck.authenticateJWTcheck, postController.deletePost);
postrouter.get("/alldetails",authCheck.authenticateJWTcheck, postController.getPostWithAllDetails);

module.exports = postrouter;
