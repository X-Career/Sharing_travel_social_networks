const express = require('express');
const {postController} = require('../controllers')

const postRouter = express.Router();

postRouter.get('/posts', postController.getPosts)
postRouter.get('/search', postController.search)



module.exports = postRouter;
