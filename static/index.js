import {Randomizer,FirstLetter, GuessWords} from './utils.js'

let container = document.querySelector("div.container")

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

let trainBtn = document.querySelector("button.train")

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

function handleGuess() {
	for (const verse of guesser.state) {
		const [_,spanText,spanVerse] = createElements()
		for (const word of verse["state"]) {
			let span = document.createElement("span")
			span.innerText = word["text"]
			spanText.appendChild(span)
			if (word["hidden"]==true) {
				span.classList.add("hidden")
			} else {
				span.classList.remove("hidden")
			}
		}
		spanVerse.innerText = verse["verse"]
	}
	let div = document.createElement("div")
	for (const opt of guesser.currentOpts) {

	} 
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
		spanText.innerText = verse["parsed"]
		p.appendChild(spanVerse)
		p.appendChild(spanText)
		div.appendChild(p)
		container.appendChild(div)
	}
}
