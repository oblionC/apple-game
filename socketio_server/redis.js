const { createClient } = require('redis')
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', err => console.log('Redis client error', err))
redisClient.connect()

// const Redis = require('ioredis')

// const redisClient = new Redis({
//     host: "redis",
//     port: 6379
// })


module.exports = redisClient