const { createClient } = require('redis')
const redisClient = createClient({
    socket: {
       tls: process.env.ENABLE_TLS === "true" ? true : false,
    },
    url: process.env.REDIS_URL,
});

redisClient.on('error', err => console.log('Redis client error', err))
redisClient.connect().then(() => console.log("connected to redis"))

// const Redis = require('ioredis')

// const redisClient = new Redis({
//     host: "redis",
//     port: 6379
// })


module.exports = redisClient
