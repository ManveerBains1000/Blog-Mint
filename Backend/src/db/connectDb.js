import mongoose from "mongoose";
import { ENV } from "../utils/env.js";
import dns from 'dns'

export const connectDb = async () => {
    try {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);     
        const connection = await mongoose.connect(`${ENV.DB_URI}/${ENV.DB_NAME}`);
        console.log(`MongoDb is connected !! DB host: ${connection.connection.host}`);
    } catch (error) {
        console.log("Database connection error: ",error);
        process.exit(1);
    }
}

