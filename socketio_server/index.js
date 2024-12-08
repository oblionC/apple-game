require('dotenv').config()
const { 
  v4: uuidv4,
} = require('uuid')
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { default: generateGameStateValues } = require('./generateGameStateValues');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

var socketInfo = {}
var socketsInRoom = {}
var waitingRooms = {};
var roomsToGameInfoMapping = {};

const clearSocketInRooms = (roomId) => {
  for(socketid of io.sockets.adapter.rooms.get(roomId)) {
    delete socketsInRoom[socketid]
  }
}

function getRoomId(socket) {
  if(socket.id in socketsInRoom) {
    return socketsInRoom[socket.id].roomId
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

function addToSocketInRoom(socketId, roomId, userInfo, rows, cols, duration) {
  socketsInRoom[socketId] =  {
    oppIds: [...io.sockets.adapter.rooms.get(roomId)].filter(id => id !== socketId),
    roomId: roomId,
    ready: false,
    userInfo: userInfo,
    rows: rows,
    cols: cols,
    duration: duration,
    queueString: generateQueueString(rows, cols, duration)
  }
}

function storeSocketInfo(roomId, userInfo, rows, cols, duration) {
  for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
    addToSocketInRoom(socketid, roomId, userInfo, rows, cols, duration)
  }
}

function leaveRoom(socket) {
  if(!(socket.id in socketsInRoom)) return 

  var roomId = socketsInRoom[socket.id].roomId
  socket.leave(roomId)
  delete socketsInRoom[socket.id]

  if(io.sockets.adapter.rooms.get(roomId) && io.sockets.adapter.rooms.get(roomId).size <= 1) {
    socket.to(roomId).emit("opponentLeftRoom", "opponent left your room")
    clearSocketInRooms(roomId)
    io.sockets.adapter.rooms.delete(roomId)
  }
}

function leaveQueue(socket) {
  if(socket.id in socketsInRoom) {
    var roomId = getRoomId(socket)
    var queueString = socketsInRoom[socket.id].queueString
    if(waitingRooms[queueString].includes(roomId)) {
      waitingRooms[queueString].splice(waitingRooms[queueString].indexOf(roomId), 1)
    }
  }
}

function generateQueueString(rows, cols, duration) {
  return `${rows} ${cols} ${duration}`
}

io.on('connection', (socket) => {
  function getOppSockets(s) {
    var oppIds = socketsInRoom[socket.id].oppIds
    return io.sockets.sockets.get(socketsInRoom[s.id].oppId)
  }


  function socketsAreReady(roomId) {
    var flag = true
    for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
      if(!socketsInRoom[socketid].ready)
        flag = false
    }
    return flag
  }

  function unreadyAllPlayers(s) {
    var roomId = socketsInRoom[s.id].roomId
    for(const id of io.sockets.adapter.rooms.get(roomId)) {
      socketsInRoom[id].ready = false
    }
  }

  socket.on('disconnect', () => {
    leaveQueue(socket)
    leaveRoom(socket)
  });

  socket.on('leaveQueue', (userInfo) => {
    leaveQueue(socket)
    socket.emit("leftQueue")
  })

  socket.on('leaveRoom', () => {
    leaveRoom(socket)
    console.log(socketsInRoom)
    console.log(waitingRooms)
    console.log(io.sockets.adapter.rooms)
    console.log("-----------------------")
  })

  socket.on('sendGameState', (gameState) => {
    if(socket.id in socketsInRoom)
      for(var socketid of socketsInRoom[socket.id].oppIds) {
        io.sockets.sockets.get(socketid).emit("getOppGameState", gameState)
      }
  })

  socket.on('setPlayerReadyState', (isReady) => {
    socketsInRoom[socket.id].ready = true
  })

  socket.on('playerIsReady', async () => {
    if(socket.id in socketsInRoom) {
      socketsInRoom[socket.id].ready = true 
      if(socketsAreReady(getRoomId(socket)) === true) {
        var rows = socketsInRoom[socket.id].rows
        var cols = socketsInRoom[socket.id].cols
        var stateValues = await generateVersusGameStateValues(rows, cols)
        io.to(getRoomId(socket)).emit("startGame", stateValues)
        unreadyAllPlayers(socket)
      }
    }
  })

  socket.on('playerIsUnready', () => {
    if(socket.id in socketsInRoom)
      socketsInRoom[socket.id].ready = false
  })
  

  socket.on('joinQueue', (userInfo, rows, cols, duration) => {
    queueString = generateQueueString(rows, cols, duration) 
    if(!waitingRooms[queueString]) {
      waitingRooms[queueString] = []
    }

    if(waitingRooms[queueString].length === 0) {
      if(socket.id in socketsInRoom) return 

      var roomId = uuidv4()
      socket.join(roomId)
      addToSocketInRoom(socket.id, roomId, userInfo, rows, cols, duration)

      waitingRooms[queueString].push(roomId)
      io.to(socket.id).emit("waitingForRoom", 'you are waiting for room')
    }  
    else {
      var roomId = waitingRooms[queueString][0]
      if(socket.id in socketsInRoom) {
        // User already in a room 
        return
      }
      if(roomId in socket.rooms) {
        // User already has a room
        return
      }
      waitingRooms[queueString].pop()
      socket.join(roomId)

      storeSocketInfo(roomId, userInfo, rows, cols, duration)

      io.to(roomId).emit("joinedRoom", 'you have joined a room')
    }
    console.log(socketsInRoom)
    console.log(waitingRooms)
    console.log(io.sockets.adapter.rooms)
    console.log("-----------------------")
  })
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});