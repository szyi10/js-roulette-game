import { TurnBasedClickGame } from "./game.js"

let game

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none"
  game = new TurnBasedClickGame()
})

document.getElementById("restartBtn").addEventListener("click", () => {
  document.getElementById("endScreen").style.display = "none"
  game.restartGame()
})
// window.addEventListener("DOMContentLoaded", () => {
// })
