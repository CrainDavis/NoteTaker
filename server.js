// dependencies
// ===============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// set up Express app
// ===============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// set up Express app to handle data parsing
// ===============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// create a unique ID for each note
// ===============================================================
let userNotes = [];

function createID(userNotes) {
    userNotes = userNotes.map((value, i) => {
        value.id = i + 1;
        return value;
    });
    return userNotes;
};

// get API route (and add a unique ID to the note)
// ===============================================================
app.get("/api/notes", (req, res) => {
    userNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    userNotes = createID(userNotes);
    return res.json(userNotes);
});

// post API route
// ===============================================================
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    newNote.id = userNotes.length + 1;
    userNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(userNotes));
    res.end();
});

// delete API route (based on the note's ID)
// ===============================================================
app.delete("/api/notes/:id", (req, res) => {
    userNotes.splice(req.params.id -1, 1);
    userNotes = createID(userNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(userNotes));
    res.end();
});

// get HTML routes ("index.html" and "notes.html")
// ===============================================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// start server to begin listening
// ===============================================================
app.listen(PORT, function() {
    console.log("App listening on: http://localhost:" + PORT);
});