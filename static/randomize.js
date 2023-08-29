class Randomize {
	constructor(text) {
		this.text = text;
		this.words = text.split(" ")
		this.state = ""
	}
	cleanWords() {
		
	}
	takeWords() {
		let percent = this.words.length >7 ? this.words.length * 0.19:this.words.length * 0.5
	let n = Math.floor(percent)
		
		
	}
	_getRandom() {
			
	}
	_group(list, n) {
	    let reminder = list.length % n
	    let g = 0
	    let groups = []
	    let temp = []
	    for (let name of list) {
		temp.push(name)
		g+=1
        if (g==n) {
            groups.push(temp.slice())
            temp.length = 0
            g=0
        }
    }
    if (reminder > 0) {
        leftover = list.slice(-reminder)
        groups.push(leftover)
    }
    return groups
	}
}

let randomizer = new Randomize("alex pedro julian jose maria andres amor arto perro cola cosa manzana mango banano lapiz peso")
randomizer.takeWords()
