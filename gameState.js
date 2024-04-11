class Player {
  constructor(name, initialLives) {
    this.name = name
    this.lives = initialLives
    this.items = []
    this.handcuffed = false
    this.roundsHandcuffed = 0
  }

  loseLife() {
    this.lives--
  }

  gainLife() {
    if (this.lives >= 5) {
      console.log("You wasted your pills...")
      return
    } else {
      this.lives++
    }
  }

  addItem(item) {
    if (this.items.length < 8) {
      this.items.push(item)
    } else {
      console.log("Player inventory full")
    }
  }

  getRandomItems() {
    const availableItems = Object.keys(items)
    const randomItems = []

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length)
      const randomItem = availableItems[randomIndex]
      randomItems.push(randomItem)
    }
    return randomItems
  }
}

class GameState {
  constructor() {
    this.playersInLobby = []
    this.gameStarted = false

    this.currentPlayer = 1
    this.round = 0
    this.currentSocket = null

    this.clicks = []
    this.emptyClicks = 0
    this.reloadFinished = false

    this.shotgunAnimationClass = "none"
  }

  createPlayers(player1, player2) {
    this.player1 = new Player(player1, 5)
    this.player2 = new Player(player2, 5)
  }

  getPlayerIndexByName(name) {
    return this.playersInLobby.findIndex((n) => n === name)
  }

  addPlayer(name) {
    this.playersInLobby.push(name)
  }

  removePlayer(name) {
    const index = this.getPlayerIndexByName(name)
    if (index >= 0) {
      this.playersInLobby.splice(index, 1)
    }
  }

  togglePlayer(player) {
    this.currentPlayer = player
  }

  loseLife(player) {
    if (player === 1) this.player1.loseLife()
    if (player === 2) this.player2.loseLife()
  }

  reloadClicks() {
    this.reloadFinished = false
    this.clicks = []
    this.emptyClicks = 0

    function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // Generate random number between 3 and 6
    const randomNumber = getRandomInt(3, 6)

    for (let i = 0; i < randomNumber; i++) {
      const isClickEmpty = Math.random() < 0.5
      const clickType = isClickEmpty ? "empty" : "regular"

      if (clickType === "empty") {
        this.emptyClicks++
      }

      this.clicks.push(clickType)
    }

    this.reloadFinished = true
  }

  nextRound() {
    this.round++
  }

  changeSocket(data) {
    this.currentSocket = data
  }
}

module.exports = GameState
