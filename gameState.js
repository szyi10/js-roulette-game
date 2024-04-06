class GameState {
  constructor() {
    this.playersInLobby = []
    this.gameStarted = false

    this.currentPlayer = 1
    this.round = 0
    this.clicks = []
    this.emptyClicks = 0

    this.shotgunAnimationClass = "none"
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

  nextRound() {
    this.round++
  }
}

module.exports = GameState
