const btn = document.querySelector("#btn")
const content = document.querySelector("#content")
const voice = document.querySelector("#voice")

function speak(text, lang = "hi-GB", rate = 1, pitch = 1, volume = 1) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = volume
  utterance.lang = lang
  window.speechSynthesis.speak(utterance)
}

function wishMe() {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 12) speak("Good Morning Sir")
  else if (hour >= 12 && hour < 4) speak("Good Afternoon Sir")
  else speak("Good Evening Sir")
}
window.addEventListener("load", () => {
  wishMe()
})
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript
  content.innerText = transcript
  takeCommand(transcript.toLowerCase())
}

function toggleVoiceUI(isListening) {
  voice.style.display = isListening ? "block" : "none"
  btn.style.display = isListening ? "none" : "flex"
}

btn.addEventListener("click", () => {
  recognition.start()
  toggleVoiceUI(true)
})

// Handle commands
function takeCommand(message) {
  toggleVoiceUI(false)

  const commands = {
    hello: () => speak("Hello Sir, what can I help you with?"),
    hey: () => speak("Hello Sir, what can I help you with?"),
    "who are you": () =>
      speak("I am a virtual assistant, created by Sir Ahmed Raza."),
    "open youtube": () => openURL("https://youtube.com/"),
    "open google": () => openURL("https://google.com/"),
    "open facebook": () => openURL("https://facebook.com/"),
    "open instagram": () => openURL("https://instagram.com/"),
    "open calculator": () => openURL("calculator://"),
    "open slack": () => openURL("slack://"),
    time: () => speak(new Date().toLocaleTimeString()),
    date: () =>
      speak(
        new Date().toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        })
      ),
    default: () => {
      const searchQuery = message.replace(/Baby Siri|Baby|Siri/gi, "").trim()
      speak(`This is what I found on the internet regarding ${searchQuery}`)
      openURL(
        `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      )
    },
  }

  const command =
    Object.keys(commands).find((key) => message.includes(key)) || "default"
  commands[command]()
}

function openURL(url) {
  speak(`Opening ${url.split("://")[0]}...`)
  window.open(url, "_blank")
}
