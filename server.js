const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

app.set("view engine", "ejs")
app.use(express.static("public"))

// Store active users of each lobby
const activeUsersPerRoom = {}

app.get("/:room", (req, res) => {
  res.render("site/lobby", { roomId: req.params.room })
})

io.on("connection", (socket) => {
  let currentRoom = ""

  socket.on("send-message", (message, room) => {
    socket.to(room).emit("receive-message", { message, name: socket.username })
  })

  socket.on("join-room", (room, username, cb) => {
    // Create new room if it doesn't exist
    if (!activeUsersPerRoom[room]) {
      activeUsersPerRoom[room] = new Set()
    }

    // Check if room is full
    if (activeUsersPerRoom[room].size >= 2) {
      cb("Room is full")
      return
    }

    socket.join(room)
    currentRoom = room
    socket.username = username

    activeUsersPerRoom[room].add(username)
    cb(`Joined lobby: ${room}`)
    io.to(room).emit("active-users", Array.from(activeUsersPerRoom[room]))
    socket.broadcast.to(currentRoom).emit("user-connected", username)
  })

  socket.on("new-user", (username) => {
    if (currentRoom && activeUsersPerRoom[currentRoom]) {
      activeUsersPerRoom[currentRoom].add(username)
      io.to(currentRoom).emit(
        "active-users",
        Array.from(activeUsersPerRoom[currentRoom])
      )
    }
  })

  socket.on("disconnect", () => {
    if (currentRoom && activeUsersPerRoom[currentRoom]) {
      activeUsersPerRoom[currentRoom].delete(socket.username)
      io.to(currentRoom).emit(
        "active-users",
        Array.from(activeUsersPerRoom[currentRoom])
      )
      const disconnectedUser = socket.username
      io.to(currentRoom).emit("user-disconnected", disconnectedUser)
    }
  })
})

function getRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return code
}

server.listen(3000, () => {
  console.log("Server listening on port 3000")
  console.log("http://localhost:3000")
})
