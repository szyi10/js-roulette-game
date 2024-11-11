// OUTPUTS
export const output = document.getElementById("output");
export const winnerOutput = document.getElementById("winner");

// BUTTONS
export const startButton = document.getElementById("start-button");
export const shotgunButton = document.getElementById("shotgun-button");
export const restartButton = document.getElementById("restart-button");
export const exitButton = document.getElementById("exit-button");

// SCREENS
export const startScreen = document.getElementById("start-screen");
export const gameScreen = document.getElementById("game-screen");
export const endScreen = document.getElementById("end-screen");

// PLAYER 1
export const player1Button = document.getElementById("player1-button");
export const player1LivesDisplay = document.getElementById("player1-lives");
export const player1ItemsDisplay = document.getElementById("player1-items");

// PLAYER 2
export const player2Button = document.getElementById("player2-button");
export const player2LivesDisplay = document.getElementById("player2-lives");
export const player2ItemsDisplay = document.getElementById("player2-items");

// SHELLS
export const shells = document.getElementById("shells");
export const shellText = document.getElementById("shell-text");
export const shellContainer = document.querySelector(".shells");

// HELPER FUNCTIONS
export function hideElement(element) {
  element.style.display = "none";
}

export function showElement(element, display) {
  element.style.display = display;
}
