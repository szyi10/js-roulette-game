export const regularSound = new Audio("./assets/sounds/regular_shot.mp3");
export const emptySound = new Audio("./assets/sounds/empty_shot.mp3");
export const shellSound = new Audio("./assets/sounds/shell.mp3");

export function playRegularSound() {
  if (regularSound.paused) {
    regularSound.play();
  } else {
    regularSound.currentTime = 0;
  }
}

export function playEmptySound() {
  if (emptySound.paused) {
    emptySound.play().catch((error) => {
      console.error("Failed to play empty click sound:", error);
    });
  } else {
    emptySound.currentTime = 0;
  }
}

export function playShellSound(times) {
  if (times <= 0) return;

  shellSound.playbackRate = 2;

  shellSound.play().catch((error) => {
    console.error("Failed to play shell sound:", error);
  });

  shellSound.onended = () => {
    if (times > 1) {
      playShellSound(times - 1);
    }
  };
}
