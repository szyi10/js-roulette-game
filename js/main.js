import { TurnBasedClickGame } from "./game.js"
import * as elements from "./elements.js"
import { hideElement, showElement } from "./elements.js"

let game

elements.createBtn.addEventListener("click", () => {
  // Create lobby and hide start screen
  hideElement(elements.startScreen)
  showElement(elements.lobbyScreen, "flex")
})

elements.startBtn.addEventListener("click", () => {
  // Hide lobby screen and start game
  hideElement(elements.lobbyScreen)
  game = new TurnBasedClickGame()
})
