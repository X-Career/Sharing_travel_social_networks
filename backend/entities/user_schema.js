const mongoose = require("mongoose");
const { Schema } = mongoose;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var validatePassword = function (password) {
  var re = /^(?=.*[A-Z])(?=.*\d).+$/;
  return re.test(password)
}

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  avatar: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate: [validatePassword, 'The password must contain at least one uppercase character and one number.'],
    match: [
      /^(?=.*[A-Z])(?=.*\d).+$/,
      'The password must contain at least one uppercase character and one number.'
    ]
  },
  vacation: {
    type: Object,
    ref: 'milestones'
  },
});

//mongo config
const User = mongoose.model('users', UserSchema)

module.exports = User;
