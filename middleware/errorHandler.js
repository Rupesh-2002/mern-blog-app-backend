const errorResponserHandler = (err, req, res, next)=>{
   const statusCode = err.statusCode || 400
   res.status(statusCode).json({message : err.message})
}

const invalidPathHandler = (req, res, next)=>{
    let error = new Error("Invalid Path")
    error.statusCode = 404
    next(error)
}

module.exports = {errorResponserHandler, invalidPathHandler};