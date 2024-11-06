let express = require("express");
let app = express();

app.use("/", express.static("public"));

let http = require("http");
let server = http.createServer(app);
let io = require("socket.io");
io = new io.Server(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("App listening at port: " + port);
});

io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);

  socket.on('sliderChange', (data) => {
    // Broadcast the slider value to all other connected clients
    io.emit('updateSoundDuration', data);
    io.emit('message-share', data);
});


  socket.on("disconnect", () => {
    console.log("A client has disconnected: " + socket.id);
  });
});

