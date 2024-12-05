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
var waitingRooms = [];
var roomsToGameInfoMapping = {};

const clearSocketInRooms = (roomId) => {
  for(socketid of io.sockets.adapter.rooms.get(roomId)) {
    delete socketsInRoom[socketid]
  }
}

const generateVersusGame = async (socket, roomId, rows, cols, duration) => {
  let url = new URL(process.env.BACKEND_URL + "/gamestatevalues")
  url.searchParams.append("rows", rows)
  url.searchParams.append("cols", cols)

  let response = await fetch(url)
  let json = await response.json()

  const game = {
    gameStateValues: json.gameStateValues,
    rows: rows,
    cols: cols,
    duration: duration
  }
  return game
}

function storeSocketInfo(roomId) {
  for(var socketid of io.sockets.adapter.rooms.get(roomId)) {
    socketsInRoom[socketid] =  {
      oppIds: [...io.sockets.adapter.rooms.get(roomId)].filter(id => id !== socketid),
      roomId: roomId,
      ready: false
    }
  }
}

function leaveRoom(socket) {
  if(!(socket.id in socketsInRoom)) return 

  var roomId = socketsInRoom[socket.id].roomId
  socket.leave(roomId)
  delete socketsInRoom[socket.id]

  if(io.sockets.adapter.rooms.get(roomId).size === 1) {
    socket.to(roomId).emit("opponentLeftRoom", "opponent left your room")
    clearSocketInRooms(roomId)
    io.sockets.adapter.rooms.delete(roomId)
  }
}

function leaveQueue(socket) {
  if(waitingRooms.includes(socket.id)) {
    waitingRooms.splice(waitingRooms.indexOf(socket.id), 1)
  }
}

io.on('connection', (socket) => {
  function getOppSockets(s) {
    var oppIds = socketsInRoom[socket.id].oppIds
    return io.sockets.sockets.get(socketsInRoom[s.id].oppId)
  }

  function getRoomId(s) {
    return socketsInRoom[s.id].roomId
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

  socket.on('playerIsReady', () => {
    if(socket.id in socketsInRoom) {
      socketsInRoom[socket.id].ready = true 
      if(socketsAreReady(getRoomId(socket)) === true) {
        io.to(getRoomId(socket)).emit("startGame")
        unreadyAllPlayers(socket)
      }
    }
  })

  socket.on('playerIsUnready', () => {
    if(socket.id in socketsInRoom)
      socketsInRoom[socket.id].ready = false
  })

  socket.on('joinQueue', (userInfo, rows, cols, duration) => {
    if(waitingRooms.length === 0) {
      if(socket.id in socketsInRoom) return 

      var roomId = uuidv4()
      socket.join(roomId)

      waitingRooms.push(roomId)
      io.to(socket.id).emit("waitingForRoom", 'you are waiting for room')
    }  
    else {
      var roomId = waitingRooms[0]
      if(socket.id in socketsInRoom) {
        // User already in a room 
        return
      }
      if(roomId in socket.rooms) {
        // User already has a room
        return
      }
      waitingRooms.pop()
      socket.join(roomId)

      storeSocketInfo(roomId)

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