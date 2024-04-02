import { Player } from "./player.js"
import * as elements from "./elements.js"
import { applyItemEffect } from "./items.js"
import {
  playEmptyClickSound,
  playRegularClickSound,
  playShellSound,
} from "./sounds.js"

export class TurnBasedClickGame {
  constructor() {
    this.init()
    this.clicks = []
    this.round = 0

    this.handlePlayerClick = this.handlePlayerClick.bind(this)
  }

  // Initialize the game
  init() {
    this.setupPlayers()
    this.setupEventListeners()
    this.updateLivesDisplay()
  }

  // Setup players with initial values
  setupPlayers() {
    this.currentPlayer = 1
    this.player1 = new Player("Player 1", 5)
    this.player2 = new Player("Player 2", 5)
    // Distribute items initially
    this.distributeItems()
  }

  // Setup event listeners for buttons
  setupEventListeners() {
    elements.mainBtn.addEventListener("click", () => this.handleClick())
    elements.player1Btn.addEventListener("click", () =>
      this.handlePlayerClick(1)
    )
    elements.player2Btn.addEventListener("click", () =>
      this.handlePlayerClick(2)
    )
  }

  // Handle rounds logic
  handleRound() {
    this.round++
    // Distribute items every two rounds
    this.distributeItems()
  }

  // Distribute items to players
  distributeItems() {
    if (this.round % 2 === 0) {
      // Concatenate new items to the existing items arrays
      this.player1.items = this.player1.items.concat(
        this.player1.getRandomItems()
      )
      this.player2.items = this.player2.items.concat(
        this.player2.getRandomItems()
      )

      // Limit the maximum number of items to 8
      if (this.player1.items.length > 8) {
        this.player1.items.length = 8
      }
      if (this.player2.items.length > 8) {
        this.player2.items.length = 8
      }
    }
    this.updateItemsDisplay()
  }

  // Handle click event on 'main' button
  handleClick() {
    if (this.clicks.length === 0) {
      this.reloadClicks()
    }

    elements.player1Btn.style.pointerEvents = "all"
    elements.player2Btn.style.pointerEvents = "all"
  }

  // Handle click event on 'player' buttons
  handlePlayerClick(playerNum) {
    const player = playerNum === 1 ? this.player1 : this.player2
    const currentClick = this.clicks.shift()

    this.handleAnimation(playerNum)

    setTimeout(() => {
      if (currentClick === "regular") {
        playRegularClickSound()
        player.loseLife()
        this.togglePlayer()
      } else if (currentClick === "empty") {
        playEmptyClickSound()
        if (this.currentPlayer !== playerNum) {
          this.togglePlayer()
        }
      }

      this.updateLivesDisplay()
      elements.player1Btn.style.pointerEvents = "none"
      elements.player2Btn.style.pointerEvents = "none"
    }, 750)
  }

  // Add animation effect to the main button
  handleAnimation(playerNum) {
    const animationClass = playerNum === 1 ? "toPlayer1" : "toPlayer2"
    elements.mainBtn.classList.add(animationClass)
    setTimeout(() => {
      elements.mainBtn.classList.remove(animationClass)
    }, 750)
  }

  // Reload clicks and generate new shells
  reloadClicks() {
    elements.shellContainer.classList.remove("slide-out")
    elements.shellContainer.classList.add("slide-in")

    this.emptyClicks = 0
    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // Generate a random number between 3 and 6
    const randomNumber = getRandomInt(3, 6)

    for (let i = 0; i < randomNumber; i++) {
      const isClickEmpty = Math.random() < 0.5
      const clickType = isClickEmpty ? "empty" : "regular"

      if (clickType === "empty") {
        this.emptyClicks++
      }

      this.clicks.push(clickType)
    }

    elements.shellText.textContent = `${
      this.clicks.length - this.emptyClicks
    } regulars. ${this.emptyClicks} blanks.
    `
    playShellSound(randomNumber)
    this.updateShellsDisplay()

    this.handleRound()
  }

  // Toggle player turn and update items display
  togglePlayer() {
    if (this.player1.handcuffed) {
      if (this.player1.roundsHandcuffed === 0) {
        this.player1.handcuffed = false
      } else {
        this.player1.roundsHandcuffed--
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
      }
    }

    if (this.player2.handcuffed) {
      if (this.player2.roundsHandcuffed === 0) {
        this.player2.handcuffed = false
      } else {
        this.player2.roundsHandcuffed--
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
      }
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1

    // Enable items for player 1
    if (this.currentPlayer === 1) {
      elements.player1ItemsDisplay.style.pointerEvents = "all"
      elements.player2ItemsDisplay.style.pointerEvents = "none"
    }
    // Enable items for player 2
    if (this.currentPlayer === 2) {
      elements.player1ItemsDisplay.style.pointerEvents = "none"
      elements.player2ItemsDisplay.style.pointerEvents = "all"
    }

    const currentPlayerItemsDisplay =
      this.currentPlayer === 1
        ? elements.player1ItemsDisplay
        : elements.player2ItemsDisplay
    currentPlayerItemsDisplay.innerHTML = "" // Clear items display
    const currentPlayerItems =
      this.currentPlayer === 1 ? this.player1.items : this.player2.items

    if (this.round % 2 !== 0 || this.round > 1) {
      if (currentPlayerItems.length > 8) {
        currentPlayerItems.length = 8
      }

      currentPlayerItems.forEach((item) => this.addItemButton(item))
    }

    this.updateItemsDisplay()
  }

  // Add item button to the player's item display
  addItemButton(item, playerNum) {
    const button = document.createElement("img")
    button.src = `/assets/items/${item}.png`
    button.className = "item"
    button.addEventListener("click", () => this.handleItemClick(item))

    // Determine which player's item display to update based on playerNum
    const currentPlayerItemsDisplay =
      playerNum === 1
        ? elements.player1ItemsDisplay
        : elements.player2ItemsDisplay

    currentPlayerItemsDisplay.appendChild(button)
  }

  // Handle item click and apply item effect
  handleItemClick(item) {
    const player = this.currentPlayer === 1 ? this.player1 : this.player2
    applyItemEffect(this, player, item)

    const indexToRemove = player.items.indexOf(item)
    if (indexToRemove !== -1) {
      player.items.splice(indexToRemove, 1)
    }

    this.updateItemsDisplay()
  }

  // Update items display for both players
  updateItemsDisplay() {
    elements.player1ItemsDisplay.innerHTML = ""
    elements.player2ItemsDisplay.innerHTML = ""

    // Add items for player 1
    this.player1.items.forEach((item) => this.addItemButton(item, 1))

    // Add items for player 2
    this.player2.items.forEach((item) => this.addItemButton(item, 2))
  }

  // Update lives display for both players
  updateLivesDisplay() {
    elements.player1LivesDisplay.textContent = `Lives: ${this.player1.lives}`
    elements.player2LivesDisplay.textContent = `Lives: ${this.player2.lives}`

    if (this.player1.lives <= 0) {
      this.endGame("Player 2")
    }

    if (this.player2.lives <= 0) {
      this.endGame("Player 1")
    }

    elements.player1Btn.classList.toggle("active", this.currentPlayer === 1)
    elements.player2Btn.classList.toggle("active", this.currentPlayer === 2)
  }

  // Update shells display based on current clicks
  updateShellsDisplay() {
    elements.shells.innerHTML = this.clicks
      .map((shell) => `<img src="./assets/${shell}-shell.png" class="shell" />`)
      .join("")

    setTimeout(() => {
      elements.shellContainer.classList.remove("slide-in")
      elements.shellContainer.classList.add("slide-out")
    }, this.clicks.length * 500 + 500)
  }

  endGame(winner) {
    elements.endScreen.style.display = "flex"
    elements.winnerOutput.textContent = winner
  }

  restartGame() {
    this.player1.lives = 5
    this.player2.lives = 5

    this.round = 0

    this.clicks = []

    this.player1.items = []
    this.player2.items = []

    this.currentPlayer = 1

    this.updateLivesDisplay()
    this.updateItemsDisplay()
    this.updateShellsDisplay()
  }
}
