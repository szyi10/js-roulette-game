export const regularClickSound = new Audio("/assets/sounds/regular_shot.mp3")
export const emptyClickSound = new Audio("/assets/sounds/empty_shot.mp3")
export const shellSound = new Audio("/assets/sounds/shell.mp3")

export function playRegularClickSound() {
  if (regularClickSound.paused) {
    regularClickSound.play()
  } else {
    regularClickSound.currentTime = 0
  }
}

export function playEmptyClickSound() {
  if (emptyClickSound.paused) {
    emptyClickSound.play().catch((error) => {
      console.error("Failed to play empty click sound:", error)
    })
  } else {
    emptyClickSound.currentTime = 0
  }
}

export function playShellSound(times) {
  if (times <= 0) return

  shellSound.playbackRate = 2

  shellSound.play().catch((error) => {
    console.error("Failed to play shell sound:", error)
  })

  shellSound.onended = () => {
    if (times > 1) {
      playShellSound(times - 1)
    }
  }
}
