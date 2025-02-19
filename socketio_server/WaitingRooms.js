const redisClient = require("./redis")

class WaitingRooms {
    constructor(redisClient) {
        this.redisClient = redisClient
        this.waitingRoomsKey = "waitingRooms"
    }

    async getWaitingRooms() {
        var res = {}
        for(var queueString of await redisClient.sUnion(this.waitingRoomsKey)) {
            res[queueString] = await redisClient.sUnion(this.waitingRoomsKey + ":" + queueString)
        }
        console.log(res)
    }

    async isQueueEmpty(queueString) {
        return !(await redisClient.exists(this.waitingRoomsKey + ":" + queueString))
    }

    async isInWaitingRooms(item, queueString) {
        return await redisClient.sIsMember(this.waitingRoomsKey + ":" + queueString, item)
    }

    async addToQueue(item, queueString) {
        if(item)
            await redisClient.sAdd(this.waitingRoomsKey + ":" + queueString, item) 
            await redisClient.sAdd(this.waitingRoomsKey, queueString)
    }

    async remFromQueue(item, queueString) {
        await redisClient.sRem(this.waitingRoomsKey + ":" + queueString, item)
        await redisClient.sRem(this.waitingRoomsKey, queueString)
    }

    async popFromQueue(queueString) {
        await redisClient.sRem(this.waitingRoomsKey, queueString)
        return await redisClient.sPop(this.waitingRoomsKey + ":" + queueString)
    }
}

module.exports = WaitingRooms