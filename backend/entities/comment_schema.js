const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    content: {
        type: String
    }
})

const Comment = mongoose.model('comments', CommentSchema)
module.exports = Comment