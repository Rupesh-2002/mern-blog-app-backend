const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename : function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const uploadPicture = multer({
    storage : storage,
    fileFilter : function(req, file, cb){
        let ext = path.extname(file.originalname)
        if(ext !== '.png' && ext !== '.jpeg' && ext !== '.jpg'){
            return cb(new Error("Only images are allowed"))
        }
        else{
           return cb(null, true)
        }
    }
})

module.exports = {uploadPicture}