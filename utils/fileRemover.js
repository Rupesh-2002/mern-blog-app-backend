const fs = require('fs')
const path = require('path')
const fileRemover = (filename)=>{
    fs.unlink(path.join(__dirname, '../uploads', filename), function(err){
        if(err && err.code === "ENOENT"){

        }
        else if(err){

        }
        else{

        }
    })
}

module.exports = {fileRemover}