package main

import (
	"database/sql"
	"flag"
	"fmt"
	"math/rand"
	"strconv"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

type Text struct {
	book    int
	chapter int
	verse   int
	text    string
}

func main() {
	var dbfile string
	var lang string
	flag.StringVar(&lang, "lang", "es", "language to use either es or en")
	flag.Parse()
	book, _ := strconv.Atoi(flag.Arg(0))
	chapter, _ := strconv.Atoi(flag.Arg(1))
	verse, _ := strconv.Atoi(flag.Arg(2))
	if lang == "en" {
		dbfile = "esv.db"
	} else {
		dbfile = "rvr1960.db"
	}
	db, err := sql.Open("sqlite3", dbfile)
	defer db.Close()
	if err != nil {
		panic(err)
	}
	query := fmt.Sprintf("SELECT * FROM bible where book=%d and chapter=%d", book, chapter)
	if len(flag.Args()) == 3 {
		query = fmt.Sprintf("SELECT * FROM bible where book=%d and chapter=%d and verse=%d", book, chapter, verse)
	}
	rows, err := db.Query(query)
	for rows.Next() {
		var row Text
		rows.Scan(&row.book, &row.chapter, &row.verse, &row.text)
		newText := ProcessText(row)
		fmt.Printf("%d %s\n", newText.verse, newText.text)
	}
}

func ProcessText(verse Text) Text {
	var newRow Text
	verse.text = strings.Replace(verse.text, "/n", "", -1)
	var newText string
	for _, word := range strings.Split(verse.text, " ") {
		newText += GetLetter(word)
	}
	newRow.book = verse.book
	newRow.chapter = verse.chapter
	newRow.verse = verse.verse
	newRow.text = newText
	return newRow
}

// get letter if it is parenthesis
// in that case it gets the second letter

func GetLetter(word string) string {
	runes := []rune(word)
	symbols := []string{"(", "¿", "¡"}
	for _, letter := range symbols {
		if string(runes[0]) == letter && len(word) > 1 {
			return string(runes[1])
		}
	}
	return string(runes[0])
}

func RandomWords(verse Text) {
	indexes := make([]int, 3)
	splited := strings.Split(verse.text, " ")
	for i := 0; i <= 3; i++ {
		random := rand.Intn(len(splited))
		indexes = append(indexes, random)
	}

}

/*
func FixText(text string) string {
	special := []string{""}
}
*/
