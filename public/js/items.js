const output = document.getElementById("output")

const showOutput = (msg) => {
  output.textContent = msg

  setTimeout(() => {
    output.textContent = ""
  }, 2000)
}

export const items = {
  bottle: {
    effect: "Skip current bullet",
    use: (game, player) => {
      const discardedClick = game.clicks[0]
      showOutput(`Discarded click: ${discardedClick}.`)
      game.clicks.shift()
      game.handleClick()
    },
  },
  flashlight: {
    effect: "See current bullet",
    use: (game, player) => {
      const currentClick = game.clicks[0]
      showOutput(`Current bullet: ${currentClick}.`)
    },
  },
  pills: {
    effect: "Recover 1 HP",
    use: (game, player) => {
      player.gainLife()
      showOutput(`${player.name} used pills.`)
      game.updateLivesDisplay()
    },
  },
  handcuffs: {
    effect: "Cuff enemy and have 2 rounds",
    use: (game, player) => {
      const currentPlayer = game.currentPlayer
      const enemyPlayer = currentPlayer === 1 ? game.player2 : game.player1

      enemyPlayer.handcuffed = true
      enemyPlayer.roundsHandcuffed = 1

      showOutput(`${player.name} used handcuffs.`)
    },
  },
}

export function applyItemEffect(game, player, item) {
  const itemEffectFunction = items[item]?.use
  if (itemEffectFunction) {
    itemEffectFunction(game, player)
  } else {
    console.log("Invalid item selected")
  }
}
