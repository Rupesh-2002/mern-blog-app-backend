const Comment = require('../models/Comment')
const Post = require('../models/Post')

const createComment = async (req, res, next)=>{
    try{

        const {desc, slug, parent, replyOnUser} = req.body
    
        const post = await Post.findOne({slug})
        if(!post){
            const error = new Error("Post was not found")
            next(error)
        }
        const newComment = new Comment({
            user : req.user._id,
            desc,
            replyOnUser, 
            parent : parent,
            post : post._id
        })
        const comment = await newComment.save()
        const savedComment = await Comment.findById(comment._id).populate([
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
        ])
        res.json(savedComment).status(201)
    }
    catch(error){
        next(error)
    }
}

const updateComment = async (req, res, next)=>{
    try{

        const {commentId} = req.params
        const {desc} = req.body
    
        const comment = await Comment.findById(commentId)

        if(!comment){
            const error = new Error("Comment was not found")
            next(error)
        }
         
        comment.desc = desc
        await comment.save()
        res.json(comment).status(201)
    }
    catch(error){
        next(error)
    }
}
const deleteComment = async (req, res, next)=>{
    try{

        const {commentId} = req.params
    
        const deletedComment = await Comment.findByIdAndDelete(commentId)
        await Comment.deleteMany({parent : deletedComment._id})

        if(!deletedComment){
            const error = new Error("Comment was not found")
            next(error)
        }
         
        res.json(deletedComment).status(201)
    }
    catch(error){
        next(error)
    }
}

module.exports = {createComment, updateComment, deleteComment}