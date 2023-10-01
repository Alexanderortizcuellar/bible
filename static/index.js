import {Randomizer,FirstLetter, GuessWords} from './utils.js'

let full = false;
let container = document.querySelector("div.container")
let tasksCon = document.querySelector("div.tasks")
let h3Tasks = document.querySelector("h3#tasks")
let backBtn = document.querySelector("button.back")
let hideCon = document.querySelector("div.hide-wrap")
let guessCon = document.querySelector("div.guess-word-wrap")
let guessOptionsCon = guessCon.querySelector("div.options")
let guessLetterCon = document.querySelector("div.guess-letter-wrap")
let letterInput = document.querySelector("input#letter")
addEvent()
let trainCon = document.querySelector("div.train-wrap")
let backLink = document.querySelector("a#back-link")
let showKeys = document.querySelector("button#show-keys")

showKeys.addEventListener("click", ()=>{letterInput.focus()})

for (const b of tasksCon.querySelectorAll("button")) {
	b.addEventListener("click", ()=>{
		switchMode(b.id)
	})
}

backBtn.addEventListener("click", ()=>{
	tasksCon.style.display = "flex"
	backBtn.style.display = "none"
	letterInput.style.display = "none"
	h3Tasks.style.display = "block"
	backLink.style.display = "flex"
	hideCons()
	resetGuess()
	resetRand()
	full = false;
	changeHeight(true)
})

function getVerses() {
	let verses = [];
	let divsContent = document.querySelectorAll("div.content");
	for (const div of divsContent) {
		let verse = processVerse(div)
		verses.push(verse)
	}
	return verses
}

function processVerse(verseDiv) {
	let verse = {
		"book":"",
		"chapter":"",
		"verse":"",
		"text":""
	}
	let verseNumber = verseDiv.querySelector("span#verse").innerText
	let text = verseDiv.querySelector("span#text").innerText
	verse["verse"] = verseNumber
	verse["text"] = text
	return verse
}

function getText(verses) {
	let text = ""
	for (const v of verses) {
		text += " " + v.text
	}
	return text
}

let verses = getVerses()
// let text = getText(verses)

let randomizer = new Randomizer(verses)
let guesser = new GuessWords(verses)
let reader = new FirstLetter(verses)

let trainBtn = document.querySelector("button#toggle-train")

trainBtn.addEventListener("click", ()=>{
	setReading()
})

let hideBtn = document.querySelector("button#hide")

hideBtn.addEventListener("click", ()=>{
	hideWords(false)
})
let randResetBtn = document.querySelector("button#rand-reset")
randResetBtn.addEventListener("click", ()=>{
	resetRand()
})


let guessResetBtn = document.querySelector("button#guess-reset")
guessResetBtn.addEventListener("click", ()=>{
	resetGuess()
})

let guessLetterResetBtn = document.querySelector("button#guess-letter-reset")
console.log(guessLetterResetBtn)
guessLetterResetBtn.addEventListener("click", ()=>{
	resetGuess()
	letterInput.value = ""
	letterInput.focus()
})

function changeHeight(out) {
	let footer = document.querySelector("div.footer")
	if (out) {
		container.style.height = "60%"
		footer.style.height = "28%" 

	} else {
		container.style.height = "75%"
		footer.style.height = "12%"
	}
}

function createElements() {
		let div = document.createElement("div")
		div.classList.add("content")
		let p = document.createElement("p")
		let spanVerse = document.createElement("span")
		spanVerse.id = "verse"
		let spanText = document.createElement("span")
		spanText.id = "text"
		p.appendChild(spanVerse)
		p.appendChild(spanText)
		div.appendChild(p)
		container.appendChild(div)
	return [div,spanText,spanVerse]
}

function hideWords(clear) {
	container.innerHTML = ""
	randomizer.takeWords()
	if (clear) {
		randomizer.reset()
	}
	for (const verse of randomizer.state) {
		const [_,spanText,spanVerse] = createElements()
		for (const word of verse["state"]) {
		let span = document.createElement("span")
		span.innerText = word["text"] + " "
		span.addEventListener("click", (evt)=>{
				flashText(evt.currentTarget)
			})
		spanText.appendChild(span)
			if (word["hidden"] == true) {
				span.classList.add("hidden")
			}
		}
		spanVerse.innerText = verse["verse"]
	}

}

function resetRand() {
	hideWords(true)
}

function handleGuess(first) {
	container.innerHTML = ""
	for (const verse of guesser.state) {
		const [_,spanText,spanVerse] = createElements()
		for (const word of verse["state"]) {
			let span = document.createElement("span")
			span.innerText = word["text"] + " "
			span.addEventListener("click", (evt)=>{
				flashText(evt.currentTarget)
			})
			spanText.appendChild(span)
			if (word["hidden"]==true) {
				span.classList.add("hidden")
			} else {
				span.classList.remove("hidden")
			}
		}
		spanVerse.innerText = verse["verse"]
	}
	if (first==false) {
		addOptions()
	}
} 

function flashText(span) {
	if (span.classList.contains("hidden")) {
		span.classList.remove("hidden")
		setTimeout(()=>{
			span.classList.add("hidden")
		}, 400)	
	}
}

function addOptions() {
	guessOptionsCon.innerHTML = ""
	if (guesser.currentOpts.length==0) {
		guessResetBtn.style.display = "block"
		guessResetBtn.style.width = "100%"
		guessOptionsCon.style.display = "none"
	
	} else {
		guessResetBtn.style.display = "none"
		guessOptionsCon.style.display = "flex"
	}
	for (const opt of guesser.currentOpts) {
		let optBtn = document.createElement("button")
		optBtn.innerText = opt
		guessOptionsCon.appendChild(optBtn)
		optBtn.addEventListener("click", (evt)=>{
	let check = guesser.go(evt.currentTarget.innerText.trim(), false)
		if (check) {
		    handleGuess(false)
		} else {
			navigator.vibrate(200)
		}
		}) 
	}
}
function resetGuess() {
	guesser.reset()
	handleGuess(false)
}

function setReading() {
	container.innerHTML = ""
	for (const verse of reader.parse()) {
		let div = document.createElement("div")
		div.classList.add("content")
		let p = document.createElement("p")
		let spanVerse = document.createElement("span")
		spanVerse.id = "verse"
		spanVerse.innerText = verse["verse"]
		let spanText = document.createElement("span")
		spanText.id = "text"
		spanText.innerText = toggleText(verse["text"],verse["parsed"])
		p.appendChild(spanVerse)
		p.appendChild(spanText)
		div.appendChild(p)
		container.appendChild(div)
	}
	if (full) {
		full = false
	} else {
		full = true
	}

}

function toggleText(opt1,opt2) {
	if (full) {
		return opt1
	}
	return opt2
}

function addEvent() {
	letterInput.addEventListener("input", (evt)=>{
		let value = evt.target.value
		let letter = value.charAt(value.length-1)
		letterInput.value = letter
		let check = guesser.go(letter.toLowerCase(), true)
		if (check) {
			handleGuess(true)
		} else {
			navigator.vibrate(200)
		}

	})
}

function hideCons() {
	let cons = [hideCon, guessCon, guessLetterCon, trainCon]
	for (const con of cons) {
		con.style.display = "none"
	}
}
function switchMode(mode) {
	if (mode=="hide-words") {
		hideCons()
		hideCon.style.display = "flex"
	}
	if (mode=="pick-words") {
		hideCons()
		guessCon.style.display = "flex"
		resetGuess()
		handleGuess(false)
	}
	if (mode=="first-letter") {
		hideCons()
		letterInput.style.display = "block"
		letterInput.focus()
		guessLetterCon.style.display = "flex"
		letterInput.value = ""
		resetGuess()
		handleGuess(true)
	}
	if (mode=="train") {
		hideCons()
		trainCon.style.display = "flex"
	}
	tasksCon.style.display = "none"
	h3Tasks.style.display = "none"
	backBtn.style.display = "block"
	backLink.style.display = "none"
	changeHeight(false)
}
