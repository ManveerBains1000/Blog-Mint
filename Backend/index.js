import { connectDb } from "./src/db/connectDb.js";
import dotenv from 'dotenv'
import {app} from './app.js'
import { ENV } from "./src/utils/env.js";

connectDb()
.then(()=>{
    app.on("ERROR",(error)=>{
        console.log("Database access error: ",error);
        throw error;
    })
    app.listen(ENV.PORT || 4000,()=>{
        console.log(`app is listening at port ${process.env.PORT}`);
    })})
.catch(()=>{
    console.log("Database connection failed !!!: ", err);
})

