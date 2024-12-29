const express = require('express')
const dotenv = require('dotenv')
const {connectDB} = require('./config/db');
const userRouter = require('./routes/userRoutes.js')
const postRouter = require('./routes/postRoutes.js')
const commentsRouter = require('./routes/commentRoutes.js')
const {errorResponserHandler, invalidPathHandler} = require('./middleware/errorHandler.js');
const path = require('path')

const cors = require('cors')


dotenv.config()
const uri = process.env.DB_URI
connectDB(uri)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    exposedHeaders : "*"
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentsRouter);

app.get('/', (req, res)=>{
    res.send('server running')
})

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler)
app.use(errorResponserHandler)

app.listen(PORT)