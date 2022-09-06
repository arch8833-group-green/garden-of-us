const chokidar = require('chokidar');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const shapeOptions = ['box', 'sphere', 'octahedron', 'torus']

app.use(express.static("static"));

app.use(express.json());

app.post("/spawn", (req, res) => {
  try {
    const { colorArray, shapeId } = req.body;
    const primitive = shapeOptions[shapeId]
    io.emit("spawn", { colorArray, primitive });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

const livereload = io.of("/livereload")

function reload() {
  const num = livereload.sockets.size
  livereload.emit("reload")
  return num
}

app.get('/reload', (req, res) => {
  const num = reload()
  res.send(`reloading ${num} client(s)`)
})

io.on("connection", (socket) => {
  console.log("socket connected");
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

chokidar.watch("./static/bridge/", { ignoreInitial: true }).on('change', (path) => {
  const num = reload()
  console.log(`Changed file ${path}, reloading ${num} client(s)`)
});
