const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const { readFromFile, readAndAppend } = require("./helpers/fsUtils");
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

app.get("/api/terms/:term", (req, res) => {
  // Coerce the specific search term to lowercase
  const requestedTerm = req.params.term.toLowerCase();

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < termData.length; i++) {
    if (requestedTerm === termData[i].term.toLowerCase()) {
      return res.json(termData[i]);
    }
  }

  // Return a message if the term doesn't exist in our DB
  return res.json("No match found");
});

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
