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

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

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

app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  readAndDelete(noteID, "./db/db.json");
});

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
