const mongoose = require('mongoose')
const { Schema } = mongoose

const PostSchema = new Schema({
    content: {
        type: String,
    },
    images: {
        type: Array
    }
})

const Post = mongoose.model('posts', PostSchema)
module.exports = Post