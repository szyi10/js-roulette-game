// OUTPUTS
export const output = document.getElementById("output")
export const winnerOutput = document.getElementById("winner")

// BUTTONS
export const mainBtn = document.getElementById("mainBtn")
export const startBtn = document.getElementById("startBtn")
export const createBtn = document.getElementById("createBtn")
export const restartBtn = document.getElementById("restartBtn")
export const joinBtn = document.getElementById("joinBtn")

// SCREENS
export const startScreen = document.getElementById("startScreen")
export const lobbyScreen = document.getElementById("lobbyScreen")
export const endScreen = document.getElementById("endScreen")
export const joinScreen = document.getElementById("joinScreen")

// PLAYER 1
export const player1Btn = document.getElementById("player1Btn")
export const player1LivesDisplay = document.getElementById("player1Lives")
export const player1ItemsDisplay = document.getElementById("player1Items")

// PLAYER 2
export const player2Btn = document.getElementById("player2Btn")
export const player2LivesDisplay = document.getElementById("player2Lives")
export const player2ItemsDisplay = document.getElementById("player2Items")

// SHELLS
export const shells = document.getElementById("shells")
export const shellText = document.getElementById("shell-text")
export const shellContainer = document.querySelector(".shells")

export function hideElement(element) {
  element.style.display = "none"
}

export function showElement(element, display) {
  element.style.display = display
}
