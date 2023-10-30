const express = require('express');
const {postController} = require('../controllers')

const postRouter = express.Router();

postRouter.get('/posts', postController.getPosts)

module.exports = postRouter;
