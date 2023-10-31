const UserModel = require("../models/user_model");
const CommentModel = require("../models/comment_model")
const PostModel = require("../models/post_model")
const handlePassword = require("../helpers/handle_password");

var randtoken = require('rand-token')
var jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;
var refreshTokens = {};


var validatePassword = function (password) {
  var re = /^(?=.*[A-Z])(?=.*\d).+$/;
  return re.test(password)
}

const createUser = async (req, res) => {
  try {
    const { password, username, email, ...rest } = req.body;

    const existingUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] });
    const isPasswordValid = validatePassword(password); // You can use your validatePassword function

    if (existingUser) {
      return res.status(400).json({
        error: 'Username or email already exists. Please choose a different one.',
      });
    }
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password. Password must contain at least one uppercase character and one number.',
      });
    }

    const hashPassword = await handlePassword.cryptPassword(password);
    const user = await UserModel.create({
      ...rest,
      username: username,
      email: email,
      password: hashPassword,
    });
    if (!user) {
      return res.status(400).json('Create user fail')
    }
    res.status(201).json({
      message: "Create user success",
    });
  } catch (e) {
    res.status(500).json('Server error')
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.login({ username, password });
    console.log(user);
    const dataToken = {
      _id: user._id,
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
      address: user.address,
      avatar: user.avatar,
      fullname: user.fullname,
      gender: user.gender,
      birthday: user.birthday,
      description: user.description,
    };
    if (user) {
      var accessToken = jwt.sign(dataToken, privateKey);
      var refreshToken = randtoken.uid(256)
      refreshTokens[refreshToken] = username
      console.log('login success');
      res.status(201).json({
        accessToken: accessToken,
        // refreshToken: refreshToken,
        message: "User logged in successfully",
          username: user.username,
          user_id: user._id,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          fullname: user.fullname,
          gender: user.gender,
          birthday: user.birthday,
          description: user.description,
      });
    }
  } catch (e) {
    res.status(500).json('Server error');
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: req.user._id },
      "_id username email"
      );
      if (!user) {
        return res.status(400).json('User not found')
      }
      res.status(200).json(user);
    } catch (e) {
    res.status(500).json('Server error');
    }
};


const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      req.body,
      { new: true }
    );
    console.log(user);
    if(!user) {
      return res.status(400).json('User not found')
    }
    res.status(200).json({
      msg: "update user success",
      user: user
    });
  } catch (e) {
    res.status(500).json('update fail');
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const currentUser = await UserModel.findOne({ _id: userId });
    if (!currentUser) {
      return res.status(400).json("User not found");
    }

    const isPasswordMatch = await handlePassword.comparePassword(
      oldPassword,
      currentUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        msg: "Current password is incorrect",
      });
    }

    const newHashPassword = await handlePassword.cryptPassword(newPassword);


    await UserModel.updateOne({ _id: userId }, { password: newHashPassword });
    res.status(200).json({
      msg: "update password",

    });
  } catch (e) {
    console.log('err: ', e);
    res.status(500).json({
      msg: "Error updating password",
      error: e,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.body;
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

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.deleteOne({ _id: req.user._id });
    if (!user) {
      return res.status(400).json("User not found");
    }
    res.status(200).json("delete user success");
  } catch (e) {
    res.status(500).json({
      msg: "Error server",
      error: e,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await UserModel.query(req.query);
    if (!result) {
      return res.status(404).json('user not found')
    }
    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({
      msg: "Error server get users",
      error: e,
    });
  }
}

const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.findMany(
      {},
      // 3,
      // 3,
    );
    console.log(posts);
    if (!posts || posts.length == 0) {
      return res.status(400).json("Post not found");
    }
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json("Error server");
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id; // Update this line to match your user identification method
    // Update the user's avatar field with the URL of the uploaded file
    const user = await UserModel.findOneAndUpdate(
      {_id: userId},
      { avatar: req.file.path }, // Assuming req.file.path contains the URL of the uploaded file
      { new: true } // This option ensures you get the updated user document
    );

    res.status(200).json({
      message:'upload success',
      url: req.file.path
    })
  } catch(error) {
    res.status(404).json("Image not found")
  }
}

const createComment = async (req, res) => {
  try {
    const userId = req.user._id
    console.log('contenttt',req.body.content);
    const comment = await CommentModel.create(
      {
        user: userId,
        content: req.body.content
      }
    )
    res.status(200).json({
      message:'comment sucess',
      comment: comment
    })
  } catch (error) {
    res.status(400).json("Cannot create comment")
  }
}

const createPost = async (req, res) => {
  try {
    const userId = req.user._id; 
    // const fileUrls = JSON.parse(req.body.imageURIs);
    // console.log('req.body', fileUrls);
    const fileUrls = []
    console.log('req.files', req.files);
    // Iterate over the uploaded files and upload them to Cloudinary
    for (const file of req.files) {
      fileUrls.push(file.path);
    }
    console.log('fileurl',fileUrls);
    const post = await PostModel.create(
      {
        user: userId,
        content: req.body.content,
        images: fileUrls
      } 
    );

    res.status(200).json({
      message:'upload success',
      post: post
    })
  } catch (error) {
    res.status(400).json('cannot create post')
  }
}


module.exports = {
  createUser,
  createComment,
  getCurrentUser,
  updateUser,
  updatePassword,
  login,
  getUser,
  getUsers,
  getPosts,
  deleteUser,
  uploadAvatar,
  createPost,
};
