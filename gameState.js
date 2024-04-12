const showOutput = (game, message) => {
  game.itemMessage = message
}

const items = {
  bottle: {
    effect: "Skip current bullet",
    use: (game, player) => {
      const discardedClick = game.clicks[0]
      showOutput(game, `Discarded click: ${discardedClick}.`)
      game.clicks.shift()
      // game.handleClick()
    },
  },
  flashlight: {
    effect: "See current bullet",
    use: (game, player) => {
      const currentClick = game.clicks[0]
      showOutput(game, `Current bullet: ${currentClick}.`)
    },
  },
  pills: {
    effect: "Recover 1 HP",
    use: (game, player) => {
      player.gainLife()
      showOutput(game, `${player.name} used pills.`)
      // game.updateLivesDisplay()
    },
  },
  handcuffs: {
    effect: "Cuff enemy and have 2 rounds",
    use: (game, player) => {
      const currentPlayer = game.currentPlayer
      const enemyPlayer = currentPlayer === 1 ? game.player2 : game.player1

      enemyPlayer.handcuffed = true
      enemyPlayer.roundsHandcuffed = 1

      showOutput(game, `${player.name} used handcuffs.`)
    },
  },
}

function applyItemEffect(game, player, item) {
  // console.log(game)
  // console.log(player)
  // console.log(item)

  const itemEffectFunction = items[item]?.use
  if (itemEffectFunction) {
    itemEffectFunction(game, player)
  } else {
    console.log("Invalid item selected")
  }
}

class Player {
  constructor(name, initialLives) {
    this.name = name
    this.lives = initialLives
    this.items = []
    this.handcuffed = false
    this.roundsHandcuffed = 0

    this.itemMessage = ""
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

  togglePlayer() {
    if (this.player1.handcuffed) {
      if (this.player1.roundsHandcuffed === 0) {
        this.player1.handcuffed = false
      } else {
        this.player1.roundsHandcuffed--
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
        this.currentSocket = this.playersInLobby[1]
      }
    }

    if (this.player2.handcuffed) {
      if (this.player2.roundsHandcuffed === 0) {
        this.player2.handcuffed = false
      } else {
        this.player2.roundsHandcuffed--
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
        this.currentSocket = this.playersInLobby[0]
      }
    }

    this.currentSocket = this.playersInLobby[this.currentPlayer === 1 ? 1 : 0]
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
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

    // Generate random amount of clicks between 3 and 6
    const randomNumber = getRandomInt(3, 6)

    for (let i = 0; i < randomNumber; i++) {
      const isClickEmpty = Math.random() < 0.5 // 50% chance to get empty click
      const clickType = isClickEmpty ? "empty" : "regular"

      if (clickType === "empty") {
        this.emptyClicks++
      }

      this.clicks.push(clickType)
    }

    this.reloadFinished = true
  }

  distributeItems() {
    if (this.round !== 0 && this.round % 2 === 0) {
      // Add new items to the existing items
      this.player1.items = this.player1.items.concat(
        this.player1.getRandomItems()
      )
      this.player2.items = this.player2.items.concat(
        this.player2.getRandomItems()
      )

      // Limit maximum number of items to 8
      if (this.player1.items.length > 8) {
        this.player1.items.length = 8
      }
      if (this.player2.items.length > 8) {
        this.player2.items.length = 8
      }
    }
  }

  handleItemUse(item) {
    console.log(item)
    const player = this.currentPlayer === 1 ? this.player1 : this.player2

    applyItemEffect(this, player, item)

    const indexToRemove =
      this.currentPlayer === 1
        ? this.player1.items.indexOf(item)
        : this.player2.items.indexOf(item)
    if (indexToRemove !== -1) {
      player.items.splice(indexToRemove, 1)
    }
  }

  nextRound() {
    this.round++
  }

  changeSocket(data) {
    this.currentSocket = data
  }
}

module.exports = GameState
