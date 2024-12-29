const User = require("../models/User");
const {
  uploadPicture,
} = require("../middleware/uploadPictureMiddleware");
const { default: mongoose } = require("mongoose");
const { fileRemover } = require("../utils/fileRemover");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User have already registered");
    }

    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }

    let userExists = await user.comparePassword(password);
    if (userExists) {
      res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (user) {
      res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
      });
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUserProfile = await user.save();
    return res.status(201).json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");
    upload(req, res, async function (err) {
      if (err) {
        let error = new Error(
          "something went wrong while uploading : " + err.message
        );
        next(error);
      } else {
        if (req.file) {
          let filename = null;
          const user = await User.findById(req.user._id)
          filename = user.avatar
          if(filename){
            fileRemover(filename)
          }
          user.avatar = req.file.filename
          await user.save()
          const updatedUser = user

          return res.status(201).json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            token: await user.generateJWT(),
          });
        } else {
          let filename;
          const updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);

          res.status(201).json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            token: await user.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
};
