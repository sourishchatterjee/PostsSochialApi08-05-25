const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const authCheck = require("../middleware/auth.check")();

router.post("/",authCheck.authenticateJWTcheck, likeController.addLike);


router.get("/getalllike",authCheck.authenticateJWTcheck, likeController.getAllLikes);


router.get("/post/:postId", authCheck.authenticateJWTcheck,likeController.getLikesByPost);


router.delete("/", authCheck.authenticateJWTcheck,likeController.deleteLike);

module.exports = router;
