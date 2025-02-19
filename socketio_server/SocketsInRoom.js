const redisClient = require("./redis")

class SocketsInRoom {
    static socketsInRoomKey;
    static oppIdsKey;
    static gameIsFinishedKey;
    static userInfoKey;

    constructor(redisClient) {
        this.socketsInRoomKey = "socketsInRoom"
        this.oppIdsKey = "oppIds"
        this.roomUserIdsKey = "roomUserIds"
        this.gameIsFinishedKey = "gameIsFinished"
        this.userInfoKey = "userInfo"
        this.roomInfoKey = "roomInfo"
        this.redisClient = redisClient
    }

    async showRedisCache() {
        console.log(this.getAllSocketInfos())
        this.getAllRooms()
    }

    async isSocketInRoom(socketid) {
        console.log(await redisClient.sIsMember(this.socketsInRoomKey, socketid))
        return await redisClient.sIsMember(this.socketsInRoomKey, socketid)
    }

    async isGameFinished(socketid) {
        return await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "gameIsFinished") === "1"
    }

    async isSocketReady(socketid) {
        return (await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "ready")) === "1"
    }

    async getSocketsInRoom() {
        return await redisClient.sUnion(this.socketsInRoomKey)
    }

    async getAllSocketInfos() {
        var socketIds = await redisClient.sUnion(this.socketsInRoomKey)
        var result = {}
        for(var socketid of socketIds) {
            result[socketid] = await redisClient.hGetAll(this.socketsInRoomKey + ":" + socketid)
        }
        return result 
    }

    async getSocketInfo(socketid) {
        return await redisClient.hGetAll(this.socketsInRoomKey + ":" + socketid)
    }

    async getSocketUserInfo(socketid) {
        return await redisClient.hGetAll(this.userInfoKey + ":" + socketid)
    }

    async getSocketOppIds(socketid) {
       return await redisClient.sUnion(this.oppIdsKey + ":" + socketid)
    }

    async getSocketRows(socketid) {
        return await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "rows")
    }

    async getSocketCols(socketid) {
        return await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "cols")
    }

    async getSocketDuration(socketid) {
        return await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "duration")
    }

    async setSocketInfo(socketid, socketInfo) {
        await redisClient.sAdd(this.socketsInRoomKey, socketid)
        await redisClient.hSet(this.socketsInRoomKey + ":" + socketid, socketInfo)
    }

    async setSocketUserInfo(socketid, userInfo) {
        await redisClient.hSet(this.userInfoKey + ":" + socketid, userInfo)
    }

    async setSocketOppIds(socketid, oppIds) {
        if(oppIds == false) {
            return
        }
        await redisClient.sAdd(this.oppIdsKey + ":" + socketid, oppIds)
    }

    async setSocketReady(socketid, ready) {
        var isReady = ready ? "1" : "0"
        await redisClient.hSet(this.socketsInRoomKey + ":" + socketid, {"ready": isReady})
    }

    async setRoomInfo(roomId, rows, cols, duration, password) {
        var roomInfo = {
            roomId: roomId,
            rows: rows,
            cols: cols,
            duration: duration,
            password: password
        }
        await redisClient.sAdd(this.roomInfoKey + ":" + "public", roomId)
        await redisClient.hSet(this.roomInfoKey + ":" + roomId, roomInfo)
    }

    async setRoomUsers(roomId, userIds) {
        await redisClient.sAdd(this.roomUserIdsKey + ":" + roomId, userIds)
    }

    async resetGameIsFinishedCounter(roomId) {
        await redisClient.set(this.gameIsFinishedKey + ":" + roomId, 0)
    }

    async remSocketInfo(socketid) {
        await redisClient.sRem(this.socketsInRoomKey, socketid)
        await redisClient.hDel(this.socketsInRoomKey + ":" + socketid, await redisClient.hKeys(this.socketsInRoomKey + ":" + socketid))

        for(var oppId of await redisClient.sUnion(this.oppIdsKey + ":" + socketid)) {
            await redisClient.sRem(this.oppIdsKey + ":" + oppId, socketid)
        }

        await redisClient.hDel(this.userInfoKey + ":" + socketid, await redisClient.hKeys(this.userInfoKey + ":" + socketid))
    }

    async remRoomInfo(roomId) {
        await redisClient.sRem(this.roomInfoKey + ":" + "public", roomId)
        await redisClient.hDel(this.roomInfoKey + ":" + roomId, await redisClient.hKeys(this.roomInfoKey + ":" + roomId))

    }

    async getRoomId(socketid) {
        return await redisClient.hGet(this.socketsInRoomKey + ":" + socketid, "roomId")
    }

    async getRoomInfo(roomId) {
        return await redisClient.hGetAll(this.roomInfoKey + ":" + roomId)
    }

    async getAllRooms() {
        console.log(await redisClient.sUnion(this.roomInfoKey + ":" + "public"))
    }
}

module.exports = SocketsInRoom