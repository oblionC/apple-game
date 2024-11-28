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

var activeRooms = []
var waitingRooms = [];
var gamesList = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('joinQueue', (userInfo, rows, cols) => {
    if(socket.rooms.size > 1) return

    if(waitingRooms.length == 0) {
      socket.join(userInfo.userId)
      waitingRooms.push(userInfo.userId)
      io.to(userInfo.userId).emit("waitingForRoom", 'you are waiting for room')
    }  
    else {
      var roomId = waitingRooms[0]
      if(userInfo.userId === roomId) {
        // User already has a room
        return
      }
      waitingRooms.pop(0)
      socket.join(roomId)
      activeRooms.push(roomId)
      io.to(roomId).emit("joinedRoom", 'you have joined a room')
    }
  })
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});