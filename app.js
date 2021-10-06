require('dotenv').config();
const port = process.env.PORT || 4001;

const express = require("express");
const app = express();
const index = require("./routes/index");
app.use(index);

const http = require("http");
const server = http.createServer(app);

// const socketIo = require("socket.io");
// const io = socketIo(server); // < Interesting!


const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});



const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};


let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  console.dir(socket)

  socket.emit('connected', { "id": socket.id }); // STEP 5 ::=> Notify request cllient that it is not connected with server  

  socket.on("move", (data) => console.log(data))

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


server.listen(port, () => {
  console.log(`listening on *:${port}`);
});



// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// const someJson = require("./info.json")
// // console.dir(someJson)
// // console.log(__dirname);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
// app.get('/fun', (req, res) => {
//   // res.send('<h1>Hello world</h1>');
//   res.send(someJson);
// });
// app.get('/anything', (req, res) => {
//   const anyJson = [{"any":"possibility"}]
//   res.send(anyJson);
// });

// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//     io.emit('chat message', msg);
//   });
// });

// // io.on('connection', (socket) => {
// //   socket.on('chat message', (msg) => {
// //     console.log('message: ' + msg);
// //   });
// // });

// // io.on('connection', (socket) => {
// //   console.log('a user connected');
// //   socket.on('disconnect', () => {
// //     console.log('user disconnected');
// //   });
// // });


// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });