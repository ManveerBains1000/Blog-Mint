import {createClient} from 'redis';
import { ENV } from '../utils/env.js';

const redisClient = createClient({
    url: `rediss://default:${ENV.REDIS_REST_TOKEN}@glowing-shepherd-93400.upstash.io:6379`,
})

redisClient.on("connect",()=>{
    console.log("Redis Connected");
})

redisClient.on("error",(err)=>{
    console.error("Redis Error:",err);
})

await redisClient.connect();

export default redisClient;