var info = ""

let lang = document.querySelector("select#lang")
let bookdrop = document.querySelector("select#book")
let chapterdrop = document.querySelector("select#chapter")
let versedrop = document.querySelector("select#verse")
let versesdrop = document.querySelector("select#verses")
lang.onchange = getInfo
book.onchange = handleCombos
chapter.onchange = handleCombosChapter

function getInfo() {
	let lang = document.querySelector("select#lang").value
	fetch("/info", {
		method: 'POST',
		body: JSON.stringify({"lang":lang}),
		headers: {'Content-Type': 'application/json'},

	})
		.then(response => response.json())
		.then(data => {
			info = data["data"]
			populateCombos(data["data"])
		})
		.catch(error => {
			console.log(error);
		});
}

window.onload = () => {
	getInfo()
}

function populateCombos(data) {
	let booksCombo = document.querySelector("select#book")
	booksCombo.innerHTML = ""
	chapter.innerHTML = ""
	verse.innerHTML = ""
	for (const [key,value] of Object.entries(data)) {
		let opt = document.createElement("option")
		opt.value = key
		opt.text = value["long_name"]
		booksCombo.add(opt)
	}
	handleCombos()
}


function handleCombos() {
	let numChapters = info[bookdrop.value]["chapters"]
	chapterdrop.innerHTML = ""
	versedrop.innerHTML = ""
	versesdrop.innerHTML = ""
	for (let i=1;i<=numChapters;i++) {
	let optChapter = document.createElement("option")
	optChapter.value = i
	optChapter.text = i
	chapterdrop.add(optChapter)
	
	}
	handleCombosChapter()
}


function handleCombosChapter() {
	versedrop.innerHTML = ""
	versesdrop.innerHTML = ""
	let numVerses = info[bookdrop.value]["verses"][parseInt(chapterdrop.value) - 1]
	console.log(info[bookdrop.value]["verses"])
	for (let i=1;i<=numVerses;i++) {
	let optVerse = document.createElement("option")
	let optVerses = document.createElement("option")
	optVerse.value = i
	optVerse.text = i
	optVerses.value = i
	optVerses.text = i
	versedrop.add(optVerse)
	versesdrop.add(optVerses)
	}
	toggleWords("alex ortiz cuellar best programmer")
}

function toggleWords(text) {
	let words = text.split(" ")
	let percent = words.length >7 ? words.length * 0.18:words.length * 0.5
	
}
