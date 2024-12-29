const express = require('express')
const router = express.Router()
const {registerUser, loginUser, userProfile, updateProfile, updateProfilePicture} = require('../controllers/userControllers.js')
const {authenticate} = require('../middleware/authMiddleware.js')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', authenticate, userProfile)
router.put('/updateProfile', authenticate, updateProfile)
router.put('/updateProfilePicture', authenticate, updateProfilePicture)
module.exports = router