const User = require("../entities/user_schema");
const BaseModel = require("./base_model");
const handlePassword = require("../helpers/handle_password");

class UserModel extends BaseModel {
  async login({ username, password }) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
    const isPasswordMatch = await handlePassword.comparePassword(
      password,
      user.password
    );
    if (isPasswordMatch) {
      return user;
    } else {
      throw new Error("Invalid passowrd");
    }
  }
}

module.exports = new UserModel(User);
