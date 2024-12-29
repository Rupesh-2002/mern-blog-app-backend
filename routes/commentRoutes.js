const express = require('express')
const router = express.Router()

const {authenticate} = require('../middleware/authMiddleware.js')
const { createComment, updateComment, deleteComment} = require('../controllers/commentControllers.js')


router.post('/',authenticate, createComment)
router.route('/:commentId')
      .put(authenticate, updateComment)
      .delete(authenticate, deleteComment)

  

module.exports = router