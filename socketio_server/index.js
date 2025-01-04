require('dotenv').config()
const { 
  v4: uuidv4,
} = require('uuid')
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redisClient = require('./redis');
const Mutex = require('redis-semaphore').Mutex
const SocketsInRoom = require('./SocketsInRoom');
const WaitingRooms = require('./WaitingRooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// var socketsInRoom = {}
var socketsInRoom = new SocketsInRoom(redisClient);
var waitingRooms = new WaitingRooms(redisClient);

async function xd() {
  await redisClient.flushAll()
  await socketsInRoom.resetGameIsFinishedCounter("123")

  // await redisClient.hSet("socketsInRoom", {"xd": "true", "wow": "amazing"})
  // await redisClient.hSet("socketsInRoom", {"wow": "xddd"})
  
  // console.log(JSON.stringify(await redisClient.hGetAll("socketsInRoom"), null, 2))
  // console.log(await redisClient.hGet("socketsInRoom", "wow"))
}

xd()

const clearSocketInRooms = async (roomId) => {
  for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
    // delete socketsInRoom[socketid]
    await socketsInRoom.remSocketInfo(socketid)
  }
}

async function getRoomId(socket) {
  // if(socket.id in socketsInRoom) {
  //   return socketsInRoom[socket.id].roomId
  // }
  if(await socketsInRoom.isSocketInRoom(socket.id)) {
    return await socketsInRoom.getRoomId(socket.id)
  }
}

const generateVersusGameStateValues = async (rows, cols) => {
  let url = new URL(process.env.BACKEND_URL + "/gamestatevalues")
  url.searchParams.append("rows", rows)
  url.searchParams.append("cols", cols)

  let response = await fetch(url)
  let json = await response.json()
  let gameStateValues = json.gameStateValues
  return gameStateValues
}

async function addToSocketInRoom(socketId, roomId, userInfo, rows, cols, duration) {
  var oppIds = [...io.sockets.adapter.rooms.get(roomId)].filter(id => id !== socketId)
  var socketInfo  =  {
    socketId: socketId,
    roomId: roomId,
    ready: "0",
    rows: rows.toString(),
    cols: cols.toString(),
    duration: duration.toString(),
    queueString: generateQueueString(rows, cols, duration),
    score: "0",
    gameIsFinished: "0" 
  }

  await socketsInRoom.setSocketInfo(socketId, socketInfo)
  await socketsInRoom.setSocketOppIds(socketId, oppIds)
  await socketsInRoom.setSocketUserInfo(socketId, userInfo)

  await updateSocketOppIds(roomId)
}

async function resetSocketInfoAfterGame(socket) {
  var roomId = await getRoomId(socket)
  var updatedInfo =  {
    score: "0", 
    ready: "0",
    gameIsFinished: "0" 
  }
  if(socketsInRoom.isSocketInRoom(socket.id)) {
    await socketsInRoom.setSocketInfo(socket.id, updatedInfo)
    await redisClient.set(socketsInRoom.gameIsFinishedKey + ":" + roomId, 0)
  }
}

async function leaveRoom(socket) {
  // if(!(socket.id in socketsInRoom)) return 
  if(!(await socketsInRoom.isSocketInRoom(socket.id))) return

  // var roomId = socketsInRoom[socket.id].roomId
  var roomId = await getRoomId(socket)

  socket.leave(roomId)

  // delete socketsInRoom[socket.id]
  await socketsInRoom.remSocketInfo(socket.id)

  if(io.sockets.adapter.rooms.get(roomId) && io.sockets.adapter.rooms.get(roomId).size <= 1) {
    socket.to(roomId).emit("opponentLeftRoom", "opponent left your room")
    await clearSocketInRooms(roomId)
    io.sockets.adapter.rooms.delete(roomId)
  }
}

async function leaveQueue(socket) {
  // if(socket.id in socketsInRoom) {
  if(await socketsInRoom.isSocketInRoom(socket.id)) {

    var roomId = await getRoomId(socket)
    var socketInfo = await socketsInRoom.getSocketInfo(socket.id)

    var queueString = socketInfo.queueString
    // if(waitingRooms[queueString].includes(roomId)) {
    if(await waitingRooms.isInWaitingRooms(roomId, queueString)) {
      // waitingRooms[queueString].splice(waitingRooms[queueString].indexOf(roomId), 1)
      await waitingRooms.remFromQueue(roomId, queueString)
    }
  }
}

async function getOppUserInfo(socket) {
  // if(socket.id in socketsInRoom) {
  if(await socketsInRoom.isSocketInRoom(socket.id)) {
    // var oppIds = socketsInRoom[socket.id].oppIds
    var oppIds = await socketsInRoom.getSocketOppIds(socket.id)
    var userInfos = []
    for(var oppId of oppIds) {
      userInfos.push(await socketsInRoom.getSocketUserInfo(oppId))
    }
    return userInfos
  }
}

async function updateSocketOppIds(roomId) {
  for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
    var oppIds = [...io.sockets.adapter.rooms.get(roomId)].filter(s => s !== socketid)
    await socketsInRoom.setSocketOppIds(socketid, oppIds)
  }
}

function generateQueueString(rows, cols, duration) {
  return `${rows}${cols}${duration}`
}

async function submitMatchInfo(socket) {
  if(await getRoomId(socket) === null) return 
  var scores = []
  var userIds = []
  var usernames = []
  for(var socketid of io.sockets.adapter.rooms.get(await getRoomId(socket))) {
    // if(socketid in socketsInRoom) {
    if(await socketsInRoom.isSocketInRoom(socketid)) {
      var socketInfo = await socketsInRoom.getSocketInfo(socketid)
      var userInfo = await socketsInRoom.getSocketUserInfo(socketid)
      scores.push(socketInfo.score)
      userIds.push(userInfo.userId)
      usernames.push(userInfo.username)
    }
  }
  var socketInfo = await socketsInRoom.getSocketInfo(socket.id)
  var requestOptions = { method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          scores: scores,
          // rows: socketsInRoom[socket.id].rows, 
          rows: socketInfo.rows,
          // cols: socketsInRoom[socket.id].cols, 
          cols: socketInfo.cols,
          // duration: socketsInRoom[socket.id].duration,
          duration: socketInfo.duration,
          userIds: userIds, 
          usernames: usernames,
      }) 
  }
  fetch(process.env.BACKEND_URL + "/matchInfo", requestOptions)
}

io.on('connection', async (socket) => {
  async function socketsAreReady(roomId) {
    var flag = true
    for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
      // if(!socketsInRoom[socketid].ready)
      var isReady = await socketsInRoom.isSocketReady(socketid)
      if(!isReady)
        flag = false
    }
    return flag
  }

  async function unreadyAllPlayers(s) {
    var roomId = await socketsInRoom.getRoomId(s.id)
    for(const id of io.sockets.adapter.rooms.get(roomId)) {
      await socketsInRoom.setSocketReady(id, false)
    }
  }

  socket.on('disconnect', async () => {
    await leaveQueue(socket)
    await leaveRoom(socket)
  });

  // socket.on('finishGame', async () => {
  //   // if(socket.id in socketsInRoom) {
  //   if(socketsInRoom.isSocketInRoom(socket.id)) {
  //     // socketInfo.gameIsFinished = true
  //     // await socketsInRoom.setSocketInfo(socket.id, {gameIsFinished: "1"})
  //     var oppIds = await socketsInRoom.getSocketOppIds(socket.id)

  //     var usersGameIsFinished = true 

  //     for(var socketid of oppIds) {
  //       if(!(await socketsInRoom.isSocketInRoom(socketid))) continue 
  //       // if(!(socketsInRoom[socketid].gameIsFinished)) {
  //       if(!(await socketsInRoom.isGameFinished(socketid))) {
  //         usersGameIsFinished = false
  //       } 
  //     }
  //     if(usersGameIsFinished) {
  //       await submitMatchInfo(socket)
  //       await resetSocketInfoAfterGame(socket)
  //     }
  //   }
  // })

  socket.on('finishGame', async () => {
    if(await socketsInRoom.isSocketInRoom(socket.id)) {
      var roomId = await getRoomId(socket)
      if(!roomId) return 
      await redisClient.incr(socketsInRoom.gameIsFinishedKey + ":" + roomId)
      var readyCount = await redisClient.get(socketsInRoom.gameIsFinishedKey + ":" + roomId)
      if(readyCount == 2) {
        await submitMatchInfo(socket)
        await resetSocketInfoAfterGame(socket) 
      }
    }
  })

  socket.on('sendScore', async (score) => {
    // if(socket.id in socketsInRoom)
    if(await socketsInRoom.isSocketInRoom(socket.id)) {
      // socketsInRoom[socket.id].score = score
      await socketsInRoom.setSocketInfo(socket.id, {score: score.toString()})
    }
  })

  socket.on('leaveQueue', async (userInfo) => {
    await leaveQueue(socket)
    socket.emit("leftQueue")
  })

  socket.on('leaveRoom', async () => {
    await leaveRoom(socket)
  })

  socket.on('sendGameState', async (gameState) => {
    if(await socketsInRoom.isSocketInRoom(socket.id))
      var oppIds = await socketsInRoom.getSocketOppIds(socket.id)
    
      for(var socketid of oppIds) {
        io.sockets.sockets.get(socketid).emit("getOppGameState", gameState)
      }
  })

  socket.on('setPlayerReadyState', (isReady) => {
    // socketsInRoom[socket.id].ready = true
    socketsInRoom.setSocketReady(socket.id, true)
  })

  socket.on('playerIsReady', async () => {
    if(await socketsInRoom.isSocketInRoom(socket.id)) {
      var isReady = !await socketsInRoom.isSocketReady(socket.id) 
      await socketsInRoom.setSocketReady(socket.id, isReady)
      socket.emit("playerIsReady", isReady)

      var roomId = await getRoomId(socket)
      if(await socketsAreReady(roomId) === true) {
        var rows = await socketsInRoom.getSocketRows(socket.id)
        var cols = await socketsInRoom.getSocketCols(socket.id)
        var stateValues = await generateVersusGameStateValues(rows, cols)
        io.to(roomId).emit("startGame", stateValues)
        await unreadyAllPlayers(socket)
      }
      else {
        for(var socketid of await socketsInRoom.getSocketOppIds(socket.id)) {
          if(await socketsInRoom.isSocketInRoom(socket.id)) {
            io.sockets.sockets.get(socketid).emit("opponentIsReady", await socketsInRoom.isSocketReady(socket.id))
          }
        }
      }
    }
  })

  socket.on('playerIsUnready', async () => {
    // if(socket.id in socketsInRoom)
    if(await socketsInRoom.isSocketInRoom(socket.id))
      // socketsInRoom[socket.id].ready = false
      await socketsInRoom.setSocketReady(socket.id, false)
  })
  
  socket.on('getOppUserInfo', async () => {
    socket.emit("getOppUserInfo", await getOppUserInfo(socket))
  }) 

  socket.on('joinQueue', async (userInfo, rows, cols, duration) => {
    // if(!waitingRooms[queueString]) {
    //   waitingRooms[queueString] = []
    // }

    // if(waitingRooms[queueString].length === 0) {

    // console.log(await socketsInRoom.getAllSocketInfos())
    var queueString = generateQueueString(rows, cols, duration)
    if(await waitingRooms.isQueueEmpty(queueString)) {
      if(await socketsInRoom.isSocketInRoom(socket.id)) return 
      var queueString = generateQueueString(rows, cols, duration) 
      var roomId = uuidv4()
      socket.join(roomId)
      await addToSocketInRoom(socket.id, roomId, userInfo, rows, cols, duration)

      // waitingRooms[queueString].push(roomId)
      await waitingRooms.addToQueue(roomId, queueString)
      io.to(socket.id).emit("waitingForRoom", 'you are waiting for room')
    }  
    else {
      var roomId = await waitingRooms.popFromQueue(queueString)
      // if(socket.id in socketsInRoom) {

      var flag = false 
      if(await socketsInRoom.isSocketInRoom(socket.id)) {
        // User already in a room 
        flag = true
      }
      if(roomId in socket.rooms) {
        // User already has a room
        flag = true
      }
      
      if(flag) {
        await waitingRooms.addToQueue(roomId, queueString)
        return 
      }
      // waitingRooms[queueString].pop()
      await waitingRooms.popFromQueue(queueString)
      socket.join(roomId)

      await addToSocketInRoom(socket.id, roomId, userInfo, rows, cols, duration)

      io.to(roomId).emit("joinedRoom")
    }
  })
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});