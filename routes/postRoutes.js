const express = require('express')
const router = express.Router()

const {authenticate} = require('../middleware/authMiddleware.js')
const { createPost, updatePost, deletePost, getPost, getAllPosts} = require('../controllers/postControllers.js')


router.route('/')
      .post(authenticate, createPost)
      .get(getAllPosts)

router.route('/:slug')
      .put(authenticate, updatePost)
      .delete(authenticate, deletePost)
      .get(getPost)
  

module.exports = router