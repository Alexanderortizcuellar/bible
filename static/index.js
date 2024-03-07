import {
	Randomizer,
	FirstLetter,
	GuessWords,
	Drag
} from './utils.js'

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
let dragCon = document.querySelector("div.drag")
let backLink = document.querySelector("a#back-link")

let showKeys = document.querySelector("button#show-keys")

let dragOptwrapper = document.querySelector("div.opt-wrapper")
showKeys.addEventListener("click", () => {
	letterInput.focus()
})

for (const b of tasksCon.querySelectorAll("button")) {
	b.addEventListener("click", () => {
		switchMode(b.id)
	})
}

backBtn.addEventListener("click", () => {
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
		"book": "",
		"chapter": "",
		"verse": "",
		"text": ""
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
console.log(verses)
// let text = getText(verses)

let randomizer = new Randomizer(verses)
let guesser = new GuessWords(verses)
let reader = new FirstLetter(verses)
let dragger = new Drag(verses)
let trainBtn = document.querySelector("button#toggle-train")

trainBtn.addEventListener("click", () => {
	setReading()
})

let hideBtn = document.querySelector("button#hide")

hideBtn.addEventListener("click", () => {
	hideWords(false)
})
let randResetBtn = document.querySelector("button#rand-reset")
randResetBtn.addEventListener("click", () => {
	resetRand()
})


let guessResetBtn = document.querySelector("button#guess-reset")
guessResetBtn.addEventListener("click", () => {
	resetGuess()
})

let guessLetterResetBtn = document.querySelector("button#guess-letter-reset")
console.log(guessLetterResetBtn)
guessLetterResetBtn.addEventListener("click", () => {
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
	return [div, spanText, spanVerse]
}

function hideWords(clear) {
	container.innerHTML = ""
	randomizer.takeWords()
	if (clear) {
		randomizer.reset()
	}
	for (const verse of randomizer.state) {
		const [_, spanText, spanVerse] = createElements()
		for (const word of verse["state"]) {
			let span = document.createElement("span")
			span.innerText = word["text"] + " "
			span.addEventListener("click", (evt) => {
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
		const [_, spanText, spanVerse] = createElements()
		for (const word of verse["state"]) {
			let span = document.createElement("span")
			span.innerText = word["text"] + " "
			span.style.color = word["flag"]
			span.addEventListener("click", (evt) => {
				flashText(evt.currentTarget)
			})
			spanText.appendChild(span)

			if (word["hidden"] == true) {
				span.classList.add("hidden")
			} else {
				span.classList.remove("hidden")
			}
		}
		spanVerse.innerText = verse["verse"]
	}
	let divs = document.querySelectorAll("div.content")
	divs = Array.from(divs)
	if (guesser.verseStep < divs.length) {
		divs[guesser.verseStep].scrollIntoView()
	}
	if (first == false) {
		addOptions()
	}
}

function flashText(span) {
	if (span.classList.contains("hidden")) {
		span.classList.remove("hidden")
		setTimeout(() => {
			span.classList.add("hidden")
		}, 400)
	}
}

function addOptions() {
	guessOptionsCon.innerHTML = ""
	if (guesser.currentOpts.length == 0) {
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
		optBtn.addEventListener("click", (evt) => {
			let check = guesser.go(evt.currentTarget.innerText.trim(), false)
			if (check) {
				handleGuess(false)
			} else {
				navigator.vibrate(200)
				console.log(guesser.state)
				flashBody()
			}
		})
	}
}

function handleError() {

}

function flashBody() {
	let body = document.querySelector("body")
	body.style.backgroundColor = "darkred"
	setTimeout(() => {
		console.log("hi")
		body.style.backgroundColor = "rgb(25,25,25)"
	}, 100)
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
		spanText.innerText = toggleText(verse["text"], verse["parsed"])
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

function toggleText(opt1, opt2) {
	if (full) {
		return opt1
	}
	return opt2
}

function addEvent() {
	letterInput.addEventListener("input", (evt) => {
		let value = evt.target.value
		let letter = value.charAt(value.length - 1)
		letterInput.value = letter
		let check = guesser.go(letter.toLowerCase(), true)
		if (check) {
			handleGuess(true)
		} else {
			navigator.vibrate(200)
			flashBody()
		}

	})
}

function hideCons() {
	let cons = [hideCon, guessCon, guessLetterCon, trainCon, dragCon]
	for (const con of cons) {
		con.style.display = "none"
	}
}

function addDragState() {
	let wordsTrack = []
	container.innerHTML = ""
	dragOptwrapper.innerHTML = ""
	for (let verse of dragger.state) {
		let div = document.createElement("div")
		let spanVerse = document.createElement("span")
		spanVerse.innerText = verse.verse
		div.appendChild(spanVerse)
		let divInner = document.createElement("div")
		divInner.classList.add("content-wrap")
		div.appendChild(divInner)
		container.appendChild(div)
		for (const word of verse.words) {
			let span = document.createElement("div")
			span.innerText = word + " ";
			divInner.appendChild(span)
			span.classList.add("dragtarget")

		}

		for (const word of verse.opts) {
			if (wordsTrack.includes(word)) {
				continue
			}
			wordsTrack.push(word)
			let btn = document.createElement("button")
			btn.innerText = word
			btn.draggable = true
			btn.classList.add("draggable")
			dragOptwrapper.appendChild(btn)
		}

	}
}

function addDragging() {
	let buttons = document.querySelectorAll("button.draggable")
	let targets = document.querySelectorAll("div.dragtarget")
	buttons.forEach((btn) => {
		btn.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("text/plain", e.currentTarget.innerText)
			console.log(e.currentTarget.innerText)
		})
		btn.addEventListener("dragend", (e) => {

		})
	})

	targets.forEach((target) => {
		target.addEventListener("dragover", (e) => {
			e.preventDefault()
		})
		target.addEventListener("dragenter", (e) => {
			console.log("over me")
			target.style.border = "1px solid red"
		})
		target.addEventListener("dragleave", (e) => {
			target.style.border = "1px solid dodgerblue"
		})
		target.addEventListener("drop", (e) => {
			e.preventDefault()
			let word = e.dataTransfer.getData("text/plain")
			console.log(word)
			target.style.border = "1px solid dodgerblue"
			let check = checkWord(word, target.innerText)
			if (check) {
				target.style.color = "white"
			} else {
				navigator.vibrate(100)
			}
		})
	})
}

function checkWord(guess, target) {
	target = target.toUpperCase()
	for (const simbol of [",", "."]) {
		target = target.replace(simbol, "")
	}
	if (guess.trim() == target.toUpperCase()) {
		return true
	}
	return false
}

function switchMode(mode) {
	changeHeight(false)
	if (mode == "hide-words") {
		hideCons()
		hideCon.style.display = "flex"
	}
	if (mode == "pick-words") {
		hideCons()
		guessCon.style.display = "flex"
		resetGuess()
		handleGuess(false)
	}
	if (mode == "first-letter") {
		hideCons()
		letterInput.style.display = "block"
		letterInput.focus()
		guessLetterCon.style.display = "flex"
		letterInput.value = ""
		resetGuess()
		handleGuess(true)
	}
	if (mode == "train") {
		hideCons()
		trainCon.style.display = "flex"
	}
	if (mode == "drag") {
		hideCons()
		dragCon.style.display = "flex"
		changeHeight(true)
		addDragState()
		addDragging()
	}
	tasksCon.style.display = "none"
	h3Tasks.style.display = "none"
	backBtn.style.display = "block"
	backLink.style.display = "none"
}
