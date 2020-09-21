// Dependencies
// =============================================================
const express = require("express");
var path = require("path");
const fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });
 // 
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
  });


  //
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
  });

async function print(path) {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      console.log(dirent.name);
    }
  }
  print('./').catch(console.error);





// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

  console.log(__dirname)