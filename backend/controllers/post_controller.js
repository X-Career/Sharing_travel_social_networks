const Post = require('../entities/post_schema');
const UserModel = require("../models/user_model");

const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ||3;

    try { 
        const posts = await Post.find()
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('comments');
        const total = await Post.countDocuments();
        console.log('posts with comment', posts);
        res.json({
            total,
            pages: Math.ceil(total / limit),
            posts
        });
    } catch (e) {
        console.log('getPosts error: ',e)
        res.status(500).json({e: 'Server error'})
    }

 }

 

 const search = async (req, res) => {
    try {
      const {username}= req.query;
      const users = await UserModel.findMany({ username: { $regex: username } });
      if (!users) {
        return res.status(400).json("User not found");
      }
      res.status(200).json({
        users,
      });
    } catch (e) {
      res.status(500).json({
        msg: "Error server",
        error: e,
      });
    }
  };

module.exports = {
    getPosts,
    search,
}