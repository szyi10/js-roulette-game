import { items } from "./items.js"

export class Player {
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
      console.log("You wasted your pills idiot...")
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
