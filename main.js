import {
  exitButton,
  restartButton,
  startButton,
  startScreen,
  endScreen,
  gameScreen,
} from "./js/elements.js";
import { TurnBasedClickGame } from "./js/game.js";

let game;

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  game = new TurnBasedClickGame();
});

restartButton.addEventListener("click", () => {
  endScreen.style.display = "none";
  game.restartGame();
});

exitButton.addEventListener("click", () => location.reload());
