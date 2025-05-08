const postModel = require("../models/postModel");
const likeModel = require("../models/likeModel");

class PostController {
  // CREATE a post
  addPost = async (req, res) => {
    try {
      const { title, content, categoryId, tags, userId } = req.body;

      if (!title || !content || !categoryId || !userId) {
        return res.status(400).json({
          success: false,
          message: "Title, content, categoryId, and userId are required",
        });
      }

      const newPost = new postModel({ title, content, categoryId, tags, userId });
      const savedPost = await newPost.save();

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: savedPost,
      });
    } catch (error) {
      console.error("Add Post Error:", error);
      res.status(500).json({
        success: false,
        message: "Post creation failed",
        error: error.message,
      });
    }
  };

  // READ all posts
  getAllPosts = async (req, res) => {
    try {
      const posts = await postModel.find().populate("userId", "name").populate("categoryId", "name");
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch posts", error: error.message });
    }
  };

  // READ a single post
  getPostById = async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id)
        .populate("userId", "name")
        .populate("categoryId", "name");

      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Optional: Get like count
      const likeCount = await likeModel.countDocuments({ postId: post._id });

      res.status(200).json({
        success: true,
        data: { ...post.toObject(), likeCount },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching post", error: error.message });
    }
  };

  // UPDATE a post
  updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, content, categoryId, tags } = req.body;

      const updatedFields = {};
      if (title) updatedFields.title = title;
      if (content) updatedFields.content = content;
      if (categoryId) updatedFields.categoryId = categoryId;
      if (tags) updatedFields.tags = tags;

      const updatedPost = await postModel.findByIdAndUpdate(postId, updatedFields, { new: true });

      if (!updatedPost) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Post update failed", error: error.message });
    }
  };

  // DELETE a post
  deletePost = async (req, res) => {
    try {
      const postId = req.params.id;

      const deletedPost = await postModel.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Delete related likes too (optional cleanup)
      await likeModel.deleteMany({ postId });

      res.status(200).json({
        success: true,
        message: "Post and associated likes deleted",
        data: deletedPost,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Post deletion failed", error: error.message });
    }
  };
}

module.exports = new PostController();
