const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
    name: String,
    img: {
        data: Buffer
    }
})

const Image = mongoose.model('image', ImageSchema)

module.exports = Image;