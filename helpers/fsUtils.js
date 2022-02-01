const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) => {
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
};

// the note is added to the database
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// the deleted note is identified by the id and deleted
// from the database
const readAndDelete = (id, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      for (i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === id) {
          parsedData.splice(i, 1);
        }
      }
      writeToFile(file, parsedData);
    }
  });
};

module.exports = { readFromFile, readAndAppend, readAndDelete };
