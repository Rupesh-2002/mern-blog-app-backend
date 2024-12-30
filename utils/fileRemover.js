
const cloudinary = require('cloudinary').v2;
const fileRemover = (filename)=>{
    const publicId = filename.split('/').pop().split('.')[0]; // Extract the public ID from the filename
    cloudinary.uploader.destroy(publicId);
}

module.exports = {fileRemover}