const Post = require("../entities/post_schema");
const BaseModel = require("./base_model");

class PostModel extends BaseModel {

}

module.exports = new PostModel(Post);