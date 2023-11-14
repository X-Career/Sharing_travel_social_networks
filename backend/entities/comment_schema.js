const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
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

const Comment = mongoose.model("comments", CommentSchema);
module.exports = Comment;
