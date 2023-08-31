class Randomize {
	constructor(text) {
		this.text = text;
		this.words = text.split(" ")
		this.state = []
		this._wordsToObjt()
	}
	cleanWords() {
		
	}
	_wordsToObjt() {
		for (let i=0;i<this.words.length;i++) {
			let item = {"index":i,"text":this.words[i],"hidden":false}
			this.state.push(item)
		}
	}
	takeWords() {
		let percent = this.words.length >7 ? this.words.length * 0.19:this.words.length * 0.5
	let n = Math.floor(percent)
	for (let i=0;i<n;i++) {
		let available = this._checkState()	
		if (available.length>0) {
			let rand = available[Math.floor(Math.random() * available.length)]
			this._changeWordState(rand)
			console.log(rand)
		}	
	}
	}
	_changeWordState(index) {
		for (const objt of this.state) {
			if (objt["index"] == index) {
				objt["hidden"] = true
			}
		}
	}
	_checkState() {
		let indexes = [];
		for (const objt of this.state) {
			if (objt["hidden"]==false) {
				indexes.push(objt["index"])
			}
		}
		return indexes
	}
	reset() {
		this.state = []
		this._wordsToObjt()
		console.log(this.state)
	}
}

let string = "alex pedro julian jose maria andres amor arto perro cola cosa manzana mango banano lapiz peso alex pedro julian"

class GuessWord {
	constructor(text) {
		this.text = text;
		this.step = 0;
		this.state = [];
		this.words = this.text.split(" ")
		this.filteredWords = this._removeDuplicates(this.words)
		this._wordsToObjt()
	}

	_wordsToObjt() {
		for (let i=0;i<this.words.length;i++) {
			let item = {"index":i,"text":this.words[i],"options":this._addOptions(this.words[i]),"hidden":true}
			this.state.push(item)
		}
	}
	_shuffle(list) {
		list.sort(()=>Math.random()-0.5)
		return list
	}
	_addOptions(word) {
		let list = this.filteredWords.slice()
		this._removeWord(list, word)
		let opts = []
		let n
		if (this.words.length<4) {
			n = 1;
		} else if (this.words.length>=4 && this.words.length <6) {
			n = 3
		} else {
			n = 5;
		}
		let available = this._checkState(list)
		for (let i=0;i<n;i++) {
			let [value,rand]  = this._choice(available)
			opts.push(list[value])
			available.splice(rand, 1)

		}
		let [_,randIndex] = this._choice(opts)
		opts.splice(randIndex,0, word)
		return this._shuffle(opts)
	}
	_checkState(list) {
		let indexes = []
		for (let i=0;i<list.length;i++) {
			indexes.push(i)
		} 	
		return indexes
	}
	_choice(list) {
		let rand = Math.floor(Math.random() * list.length)
		return [list[rand], rand]
	}
	_removeDuplicates(list) {
		return [...new Set(list)]
	}
	_removeWord(list, word) {
		let index = list.indexOf(word)
		list.splice(index, 1)
	}
	go(word) {
		if (word==this.state[this.step]["text"]) {
			this.state[this.step]["hidden"] = false;
			this.step += 1
			return true
		}
		return false
	}

}

let g = new GuessWord(string)
g.go("alex")
g.go("alex")
console.log(g.step)
console.log(g.state)
