class GameState {
  constructor() {
    this.playersInLobby = []
    this.currentPlayer = 1
    this.gameStarted = false
    this.round = 0
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
