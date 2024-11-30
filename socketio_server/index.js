require('dotenv').config()
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

var socketIdToUserIdMapping = {}
var socketsInRoom = {}
var waitingRooms = [];
var roomsToGameInfoMapping = {};

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

function storeSocketInfo(id, oppId, roomId) {
  socketsInRoom[id] =  {
    oppId: oppId, 
    roomId: roomId 
  }
  socketsInRoom[oppId] = {
    oppId: id,
    roomId: roomId
  }
}

function leaveRoom(socket) {
  if(!(socket.id in socketsInRoom)) return 

  var oppId = socketsInRoom[socket.id].oppId
  var roomId = socketsInRoom[socket.id].roomId

  delete socketsInRoom[socket.id]
  delete socketsInRoom[oppId]

  io.sockets.sockets.get(oppId).emit("opponentLeftRoom", "opponent left your room")
  io.sockets.sockets.get(oppId).leave(roomId)
}

function leaveQueue(socket) {
  waitingRooms.splice(waitingRooms.indexOf(socket.id), 1)
  delete socketIdToUserIdMapping[socket.id]
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    leaveQueue(socket)
    leaveRoom(socket)
  });

  socket.on('leaveQueue', (userInfo) => {
    leaveQueue(socket)
  })

  socket.on('joinQueue', (userInfo, rows, cols, duration) => {
    if(socket.rooms.size > 1) return

    if(waitingRooms.length == 0) {
      waitingRooms.push(socket.id)
      io.to(socket.id).emit("waitingForRoom", 'you are waiting for room')
    }  
    else {
      var roomId = waitingRooms[0]
      if(socket.id in socketsInRoom) {
        // User already in a room 
        return
      }
      if(socket.id === roomId) {
        // User already has a room
        return
      }
      waitingRooms.pop()
      socket.join(roomId)

      storeSocketInfo(roomId, socket.id, roomId)

      io.to(roomId).emit("joinedRoom", 'you have joined a room')
      generateVersusGame(socket, roomId, rows, cols, duration)
    }
    console.log(socketsInRoom)
    console.log(waitingRooms)
    console.log(io.sockets.adapter.rooms)
  })
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});