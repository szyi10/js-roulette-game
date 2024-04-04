import { TurnBasedClickGame } from "./game.js"
import * as elements from "./elements.js"
import { hideElement, showElement } from "./elements.js"

const activePlayers = document.getElementById("lobbyPlayers")

const socket = io("/")
const name = `Player ${Math.floor(Math.random() * 9)}`

socket.on("connect", () => {
  socket.emit("new-user", name)
  socket.emit("join-room", ROOM_ID, name, (message) => {
    console.log(message)
  })
})

socket.on("receive-message", (data) => {
  console.log(`${data.name}: ${data.message}`)
})

socket.on("user-connected", (name) => {
  console.log(`${name} connected`)
  updateActiveUsers()
})

socket.on("user-disconnected", (name) => {
  console.log(`${name} disconnected`)
  updateActiveUsers()
})

socket.on("active-users", (users) => {
  updateActiveUsers(users)
})

let game

elements.startBtn.addEventListener("click", () => {
  // Hide lobby screen and start game
  hideElement(elements.lobbyScreen)
  game = new TurnBasedClickGame()
})

function updateActiveUsers(users) {
  activePlayers.innerHTML = ""

  users.forEach((user) => {
    const userElement = document.createElement("div")
    userElement.classList.add("player")
    userElement.innerHTML = `
      <img
        src="/assets/avatars/blank/Icons_03.png"
        alt="Player 1 avatar"
        class="player__img"
      />
      <div class="player__info">
        <p class="player__name">${user}</p>
        <span class="player__status">Connected</span>
      </div>
    `

    activePlayers.appendChild(userElement)
  })
}
