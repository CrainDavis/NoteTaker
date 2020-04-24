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

// view all JSON notes in browser
app.get("/api/notes", (req, res) => {
    // read JSON file
    notes = JSON.parse(fs.readFileSync("./db/db.json"));
    // display notes in JSON format in browser
    res.json(notes);
});

// view particular JSON note based on the ID
app.get("/api/notes/:id", (req, res) => {
    const chosenNote = req.params.id;

    // run through the notes array until the user's chosen note is found
    for (var i = 0; i < notes.length; i++) {
        if (chosenNote === notes[i].id) {
            // show the user's chosen note
            return res.json(notes[i]);
        }
    }

    // if no matching note is found, display nothing
    return res.send("Cannot find note with the ID of " + req.params.id + ". Please make sure you have the correct ID.");
});

// post new note to API route (and generate unique ID for note)
// ===============================================================
app.post("/api/notes", (req, res) => {
    // read the file with all of the existing notes
    notes = JSON.parse(fs.readFileSync("./db/db.json"));

    // add new note to notes array with a generated ID
    notes.push({
        id: uuid(),
        title: req.body.title,
        text: req.body.text
    });
    
    // write new note to the json file
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(true);
});

// delete designated note from API route (based on the note's ID)
// ===============================================================
app.delete("/api/notes/:id", (req, res) => {
    // read the JSON file for notes
    notes = JSON.parse(fs.readFileSync("./db/db.json"));
    // remove the user's designated note for deletion
    const alteredNotes = notes.filter(note => note.id !== req.params.id);
    // rewrite the JSON notes
    fs.writeFileSync("./db/db.json", JSON.stringify(alteredNotes));
    // display the updated JSON data
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