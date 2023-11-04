const Post = require('../entities/post_schema');

const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ||3;

    try { 
        const posts = await Post.find()
            .sort({createdAt: -1})
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Post.countDocuments();
        
        res.json({
            total,
            pages: Math.ceil(total / limit),
            posts
        });
    } catch (e) {
        console.log('getPosts error: ',e)
        res.status(500).json({e: 'Server error'})
    }

 }


module.exports = {
    getPosts
}