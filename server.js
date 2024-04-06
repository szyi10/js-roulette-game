const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const GameState = require("./GameState")

app.set("view engine", "ejs")
app.use(express.static("public"))

// Store active users of each lobby
const activeUsersPerRoom = {}

// Map to store GameState instances for each room
const gameStatesPerRoom = {}

app.get("/:room", (req, res) => {
  res.render("site/lobby", { roomId: req.params.room })
})

io.on("connection", (socket) => {
  // Variable to store curret room for each socket
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

    // Join the room
    socket.join(room)
    currentRoom = room
    socket.username = username

    // Add user to active users in the room
    activeUsersPerRoom[room].add(username)
    cb(`Joined lobby: ${room}`)
    io.to(room).emit("active-users", Array.from(activeUsersPerRoom[room]))
    socket.broadcast.to(currentRoom).emit("user-connected", username)

    // Initialize game state for the room if it doesn't exist
    if (!gameStatesPerRoom[room]) {
      gameStatesPerRoom[room] = new GameState()
    }

    // Add user to game
    gameStatesPerRoom[room].addPlayer(username)
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

      // Remove user from game
      if (gameStatesPerRoom[currentRoom]) {
        gameStatesPerRoom[currentRoom].removePlayer(disconnectedUser)
      }
    }
  })

  socket.on("vote-start", (player) => {
    io.to(currentRoom).emit("start-game")
    if (gameStatesPerRoom[currentRoom]) {
      gameStatesPerRoom[currentRoom].gameStarted = true
    }
  })

  socket.on("handle-click", (data) => {
    io.to(currentRoom).emit("handle-click", data)
  })

  socket.on("next-round", () => {
    if (gameStatesPerRoom[currentRoom]) {
      gameStatesPerRoom[currentRoom].nextRound()
    }
  })

  socket.on("toggle-player", (player) => {
    if (gameStatesPerRoom[currentRoom]) {
      gameStatesPerRoom[currentRoom].togglePlayer(player)
    }
  })

  socket.on("add-empty-click", () => {
    if (gameStatesPerRoom[currentRoom]) {
      gameStatesPerRoom[currentRoom].emptyClicks++
    }
  })

  socket.on("push-click", (clickType) => {
    if (gameStatesPerRoom[currentRoom]) {
      gameStatesPerRoom[currentRoom].clicks.push(clickType)
    }
  })

  socket.on("handle-animation", (playerNum) => {
    if (currentRoom) {
      io.to(currentRoom).emit("shotgun-animate", playerNum)
    }
  })

  setInterval(() => {
    if (currentRoom && gameStatesPerRoom[currentRoom]) {
      io.to(currentRoom).emit("game-state", gameStatesPerRoom[currentRoom])
    }
  }, 1000 / 20)
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
