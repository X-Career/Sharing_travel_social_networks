const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    username: {
        type: String,
        ref: "users"
    },
    avatar: {
        type: String,
        ref: "users"
    },
    content: {
      type: String,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model("posts", PostSchema);
module.exports = Post;
