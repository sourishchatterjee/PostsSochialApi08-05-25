const mongoose = require("mongoose");
const likeModel = require("../models/likeModel");

class LikeController {
  // Create a like
  addLike = async (req, res) => {
    try {
      const { userId, postId } = req.body;

      if (!userId || !postId) {
        return res.status(400).json({
          success: false,
          message: "userId and postId are required",
        });
      }

      // Check if already liked checkkk
      const alreadyLiked = await likeModel.findOne({ userId, postId });
      if (alreadyLiked) {
        return res.status(400).json({
          success: false,
          message: "Post already liked by this user",
        });
      }

      const newLike = new likeModel({ userId, postId });
      const savedLike = await newLike.save();

      res.status(201).json({
        success: true,
        message: "Like added successfully",
        data: savedLike,
      });
    } catch (error) {
      console.error("Add Like Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add like",
        error: error.message,
      });
    }
  };

    // Get all likes using aggregation
    getAllLikes = async (req, res) => {
      try {
        const likes = await likeModel.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $lookup: {
              from: "posts",
              localField: "postId",
              foreignField: "_id",
              as: "post",
            },
          },
          {
            $unwind: "$post",
          },
        ]);
  
        res.status(200).json({
          success: true,
          data: likes,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch likes",
          error: error.message,
        });
      }
    };
  
    // Get likes for a specific post using aggregation
    getLikesByPost = async (req, res) => {
      try {
        const postId = new mongoose.Types.ObjectId(req.params.postId);
  
        const likes = await likeModel.aggregate([
          {
            $match: { postId: postId },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
        ]);
  
        res.status(200).json({
          success: true,
          data: likes,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch likes for this post",
          error: error.message,
        });
      }
    };
  }
  

  // Delete a like
  deleteLike = async (req, res) => {
    try {
      const { userId, postId } = req.body;

      const deleted = await likeModel.findOneAndDelete({ userId, postId });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Like not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Like removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to remove like",
        error: error.message,
      });
    }
  };


module.exports = new LikeController();
