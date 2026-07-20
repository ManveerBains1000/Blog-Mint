import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

// import routes

// user routes
import userRouter from './src/routes/user.routes.js'
import postRouter from './src/routes/post.routes.js'


// health check api
app.get('/health',(req,res)=>{
    
    res.send("app is running");
})

app.use('/api/v1/user',userRouter);
app.use('/api/v1/post',postRouter);


export {app};