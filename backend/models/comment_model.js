const Comment = require("../entities/comment_schema");
const BaseModel = require("./base_model");

class CommentModel extends BaseModel {

}

module.exports = new CommentModel(Comment);
