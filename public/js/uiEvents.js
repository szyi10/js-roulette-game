import * as elements from "./elements.js"

if (elements.startScreen) {
  // CREATE LOBBY BUTTON
  elements.createBtn.addEventListener("click", () => {
    // Generate random lobby code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let lobbyCode = ""
    for (let i = 0; i < 6; i++) {
      lobbyCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      )
    }

    location.assign(`/${lobbyCode}`)
  })

  // JOIN LOBBY BUTTON
  elements.joinBtn.addEventListener("click", () => {
    elements.joinScreen.style.display = "flex"
  })

  // BACK TO MAIN MENU BUTTON
  elements.backBtn.addEventListener("click", () => {
    elements.joinScreen.style.display = "none"
  })

  elements.joinForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const value = elements.joinCodeInput.value

    if (!value) return

    if (value.length < 6) {
      return console.log("Enter valid code!")
    }

    location.assign(`/${value.toUpperCase()}`)
  })
}

if (elements.lobbyScreen) {
  elements.leaveBtn.addEventListener("click", () => {
    location.assign("/")
  })
}
