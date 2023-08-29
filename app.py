import json
from flask import Flask, jsonify, render_template, request
import sqlite3
from rich import print

app = Flask(__name__)


with open("books.json") as f:
    data = json.load(f)


def load_data(lang, book,
              chapt, verse, verses):
    repl_value = ""
    clean_data = []
    db = "esv.db" if lang == "english" else "rvr1960.db"
    con = sqlite3.connect(db)
    cursor = con.cursor()
    query = f"""
        SELECT * FROM bible
        WHERE book={book} and
        chapter={chapt} and
        verse BETWEEN {verse} AND
        {verses}
    """
    cursor.execute(query)
    data = cursor.fetchall()
    for row in data:
        clean_data.append(list(row))
    for row in range(len(data)):
        clean_data[row][3] = clean_data[row][3].replace("/n", repl_value)
    return clean_data


def get_first_letter(text: str):
    pass


@app.route("/", methods=["GET"])
def home():
    temp = render_template("index.html")
    return temp


@app.route("/tasks", methods=["GET"])
def go_tasks():
    lang = request.args.get("lang")
    book = request.args.get("book")
    chapter = request.args.get("chapter")
    verse = request.args.get("verse")
    verses = request.args.get("verses")
    print(lang, book, chapter, verse)
    book_index = data[lang][book]["index"]
    text = load_data(lang, book_index, chapter, verse, verses)
    temp = render_template("game.html", chapter=chapter, text=text)
    return temp


@app.route("/info", methods=["POST"])
def get_info():
    lang = request.get_json().get("lang")
    lang_info = data[lang]
    return jsonify({"data": lang_info})
