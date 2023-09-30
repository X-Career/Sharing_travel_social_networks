const UserModel = require("../models/user_model");
const ImageModel = require("../models/image_model")
const handlePassword = require("../helpers/handle_password");

var randtoken = require('rand-token')
var jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;
var refreshTokens = {};
const upload = require("../helpers/upload_image");


var validatePassword = function (password) {
  var re = /^(?=.*[A-Z])(?=.*\d).+$/;
  return re.test(password)
}

const createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const isPasswordValid = validatePassword(password); // You can use your validatePassword function

    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password. Password must contain at least one uppercase character and one number.',
      });
    }

    const hashPassword = await handlePassword.cryptPassword(password);
    const user = await UserModel.create({
      ...rest,
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
      email: user.email,
      password: user.password,
      role: user.role,
      address: user.address,
      avatar: user.avatar
    };
    if (user) {
      var accessToken = jwt.sign(dataToken, privateKey);
      var refreshToken = randtoken.uid(256)
      refreshTokens[refreshToken] = username
      console.log('login success');
      res.status(201).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: "User logged in successfully",
          username: user.username,
          user_id: user._id,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
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
    res.status(500).json('Server error');
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

const uploadAvatar = async (req, res) => {
  console.log('res');
  upload(req, res, function (err) {
      if (err) {
          return res.status(400).json({
              success: false,
              error: err
          })
      }
      console.log('req.file: ', req.file);
      res.status(200).json({
          success: true,
          data: {...req.file}
      })
  })
}

const getImage = async (req, res) => {
  try {
    const result = await ImageModel.findMany();
    if (!result) {
      return res.status(404).json('image not found')
    }
    res.status(200).json(result)
  } catch (e) {
    res.status(500).json({
      msg: "Error server get images",
      error: e,
    });
  }
}


module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  login,
  getUser,
  getUsers,
  deleteUser,
  uploadAvatar,
  getImage
};
