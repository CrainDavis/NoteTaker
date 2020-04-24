// dependencies
// ===============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v4");

// set up Express app
// ===============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// set up Express app to handle data parsing
// ===============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // serve static file from public directory

// get API routes
// ===============================================================
let notes = [];

app.get("/api/notes", (req, res) => {
    notes = JSON.parse(fs.readFileSync("./db/db.json"));
    res.json(notes);
});

// view JSON notes based on the ID of a note
app.get("/api/notes/:id", (req, res) => {
    const chosenNote = req.params.id;
    console.log(chosenNote);

    for (var i = 0; i < notes.length; i++) {
        if (chosenNote === notes[i].id) {
            return res.json(notes[i]);
        }
    }

    return res.json(false);
});

// post new note to API route (and generate unique ID for note)
// ===============================================================
app.post("/api/notes", (req, res) => {
    notes = JSON.parse(fs.readFileSync("./db/db.json"));
    notes.push({
        id: uuid(),
        title: req.body.title,
        text: req.body.text
    });
    
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(true);
});

// delete designated note from API route (based on the note's ID)
// ===============================================================
app.delete("/api/notes/:id", (req, res) => {
    notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const alteredNotes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(alteredNotes));
    res.json(true);
});

// get HTML routes ("index.html" and "notes.html")
// ===============================================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// start server to begin listening
// ===============================================================
app.listen(PORT, function() {
    console.log("App listening on: http://localhost:" + PORT);
});