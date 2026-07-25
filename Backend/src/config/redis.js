import {createClient} from 'redis';

const redisClient = createClient({
    url: "your url",
})

redisClient.on("connect",()=>{
    console.log("Redis Connected");
})

redisClient.on("error",(err)=>{
    console.error("Redis Error:",err);
})

await redisClient.connect();

export default redisClient;