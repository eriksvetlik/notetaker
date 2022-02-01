const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const {
  readFromFile,
  readAndAppend,
  readAndDelete,
} = require("./helpers/fsUtils");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// route to send user to index.html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// route to send user to notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// when the user is at /api/notes, the readFromFile function brings the
// note list from the database
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// when the user submits a note, the note title and text are sent to the database
// with the readAndAppend function
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const addNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(addNote, "./db/db.json");

    const response = {
      status: "success",
      body: addNote,
    };

    console.log(response);

    res.json(response);
  } else {
    res.json("Error in posting feedback");
  }
});

// when the user deletes a note, the readAndDelete function deletes the note
// from the database and the list is read again to display
app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  readAndDelete(noteID, "./db/db.json");
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
