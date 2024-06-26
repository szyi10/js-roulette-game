import { TurnBasedClickGame } from "./game.js"
import * as elements from "./elements.js"
import { hideElement, showElement } from "./elements.js"

const activePlayers = document.getElementById("lobbyPlayers")
const messageInput = document.getElementById("message")
const form = document.getElementById("message-form")

const socket = io()

let name = localStorage.getItem("username")
if (!name) {
  localStorage.setItem("username", `Player ${getRandomNumbers()}`)
  name = localStorage.getItem("username")
}
let me = {
  username: name,
}

socket.on("connect", () => {
  socket.emit("new-user", name)
  socket.emit("join-room", ROOM_ID, name, (message) => {
    displayInfo(message)
  })
})

socket.on("receive-message", (data) => {
  displayOpponentsMessage(data.message, data.name)
})

socket.on("user-connected", (name) => {
  displayInfo(`${name} connected`)
})

socket.on("user-disconnected", (name) => {
  displayInfo(`${name} disconnected`)
})

socket.on("active-users", (users) => {
  updateActiveUsers(users)
})

socket.on("start-game", () => {
  // Hide lobby screen and start game
  hideElement(elements.lobbyScreen)
  game.init()
})

socket.on("shotgun-animate", (playerNum) => {
  game.handleAnimation(playerNum)
})

socket.on("clicks-reloaded", (data) => {
  game.handleReloadAnimation(data)
})

socket.on("items-distributed", (data) => {
  game.updateItemsDisplay(data.player1, data.player2)
})

socket.on("item-used", (itemMessage, data) => {
  displayInfo(itemMessage)
  game.updateItemsDisplay(data.player1, data.player2)
})

let game = new TurnBasedClickGame(socket, me)

elements.startBtn.addEventListener("click", () => {
  socket.emit("vote-start", name)
  displayInfo(`${name} voted for start!`)
})

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const message = messageInput.value

  if (message === "") return
  displayYourMessage(message)
  socket.emit("send-message", message, ROOM_ID)

  messageInput.value = ""
})

function displayInfo(message) {
  const div = document.createElement("div")
  div.classList.add("chat__message-info")

  div.textContent = message

  document.getElementById("chat-messages").append(div)
}

function displayYourMessage(message) {
  const div = document.createElement("div")
  div.classList.add("chat__message")

  div.innerHTML = `<span class='chat__message-you'>You: </span> ${message}`

  document.getElementById("chat-messages").append(div)
}

function displayOpponentsMessage(message, name) {
  const div = document.createElement("div")
  div.classList.add("chat__message")

  div.innerHTML = `<span class='chat__message-opponent'>${name}: </span> ${message}`

  document.getElementById("chat-messages").append(div)
}

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

function getRandomNumbers() {
  const characters = "0123456789"
  let number = ""
  for (let i = 0; i < 2; i++) {
    number += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return number
}

socket.on("game-state", (state) => {
  game.setState(state)
})
