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
app.use(express.static("public")); // serve static file from public directory

// create a unique ID for each note
// ===============================================================
let allNotes = []; // array to hold all of the notes

// generates a unique ID for each note based on its index in the allNotes array
function createID(allNotes) {
    allNotes = allNotes.map((value, i) => {
        value.id = i + 1; // 1 needs to be added, since ID cannot be 0
        return value;
    });
    return allNotes;
};

// get API route (and add a unique ID to the note)
// ===============================================================
app.get("/api/notes", (req, res) => {
    allNotes = JSON.parse(fs.readFileSync("./db/db.json")); // get the array
    allNotes = createID(allNotes); // assign IDs to each note in array
    return res.json(allNotes); // return notes on the page
});

// view JSON notes based on ID number
app.get("/api/notes/:id", (req, res) => {
    const noteId = Number(req.params.id);
    const getNote = allNotes.find((note) => note.id === noteId);

    if (!getNote) {
        res.status(500).send("cannot find note")
    } else {
        res.json(getNote);
    }
});

// post API route
// ===============================================================
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    newNote.id = allNotes.length + 1; // give an ID to new note
    allNotes.push(newNote); // push new note to the array
    fs.writeFileSync("./db/db.json", JSON.stringify(allNotes)); // write the new note to db.json
    res.end();
});

// delete API route (based on the note's ID)
// ===============================================================
app.delete("/api/notes/:id", (req, res) => {
    allNotes.splice(req.params.id - 1, 1); // remove the designated note from the allNotes array
    allNotes = createID(allNotes); // update the IDs in the notes array after removal
    fs.writeFileSync("./db/db.json", JSON.stringify(allNotes)); // rewrite the notes after one has been deleted
    res.end();
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