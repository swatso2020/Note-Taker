const express = require("express");
var fs = require('fs');
var path = require("path");


var app = express();
var PORT = 3000;
var storedNotes =""


// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//console.log(notesStorage)
 fs.readFile(__dirname +"/db/db.json", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    //reads data from json file and turns it in JS object
    storedNotes = JSON.parse(data)
    console.log(storedNotes);
    storedNotes2 = JSON.stringify(storedNotes)
    console.log(storedNotes2);
   
    
  
  });

  console.log(storedNotes)

