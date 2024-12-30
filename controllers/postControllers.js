const Post = require("../models/Post");
const { uploadPicture } = require("../middleware/uploadPictureMiddleware");
const { mongoose } = require("mongoose");
const { fileRemover } = require("../utils/fileRemover");
const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/Comment");

const createPost = async (req, res, next) => {

  try {
    const upload = uploadPicture.single("postPicture");
    const handleCreatePostData = async (data, photo) => {
      try{

        const { title, caption, body, tags, categories } = JSON.parse(data);
        const post = new Post({
          title,
          caption,
          body,
          tags,
          categories,
          slug : uuidv4(),
          user : req.user._id,
          photo
        })
        const createdPost = await post.save()
        return res.json(createdPost)
      }
      catch(error){
         next(error)
      }
    };
    upload(req, res, async function (err) {
      if (err) {
        let error = new Error(
          "something went wrong while uploading : " + err.message
        );
        next(error);
      } else {
        if (req.file) {
        handleCreatePostData(req.body.document, req.file.path);
          
        }
        else{

          handleCreatePostData(req.body.document, "");
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      let error = new Error("Post not found");
      next(error);
    }
    const upload = uploadPicture.single("postPicture");
    const handleUpdatePostData = async (data) => {
      try{
        const { title, caption, slug, body, tags, categories } = JSON.parse(data);
        post.title = title || post.title;
        post.caption = caption || post.caption;
        post.slug = slug || post.slug;
        post.body = body || post.body;
        post.tags = tags || post.tags;
        post.categories = categories || post.categories;
        const updatedPost = await post.save();
        return res.json(updatedPost);
      }
      catch(error){
        next(error)
      }
    };
    upload(req, res, async function (err) {
      if (err) {
        let error = new Error(
          "something went wrong while uploading : " + err.message
        );
        next(error);
      } else {
        if (req.file) {
          const previousFilename = post.photo;
          if (previousFilename) {
            fileRemover(previousFilename)
          }
          post.photo = req.file.path;  // This will hold the URL of the uploaded image on Cloudinary
        }
        handleUpdatePostData(req.body.document);
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      let error = new Error("Post not found");
      next(error);
    }
    const fileName = post.photo
    if(fileName){
      fileRemover(fileName)
    }
    await Comment.deleteMany({ post: post._id });
    res.status(201).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      { 
        path: "user", 
        select : ['avatar', 'name']
      },
      {
        path : 'comments',
        match : {
            parent : null
        },
        populate : [
            {
                path : 'user',
                select : ['avatar', 'name']
            },
            {
                path : 'replies',
                populate : [
                  {
                    path : 'user',
                    select : ['avatar', 'name']
                  }
                ]
            }
        ]
      }
    ]);
    if (!post) {
      throw Error("Post was not found");
    }
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next)=>{
  try {
    const filter = req.query.searchKeyword;

    let where = {};

    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }

    let query = Post.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize)

    res.header({
      "X-filter": filter,
      "X-totalcount": JSON.stringify(total),
      "X-currentpage": JSON.stringify(page),
      "X-pagesize": JSON.stringify(pageSize),
      "X-totalpagecount": JSON.stringify(pages),
    })

    if (page > pages) {
      return res.json([])
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts
};
