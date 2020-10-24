// ============================================================= 
// Dependencies
// =============================================================
const express = require("express");
var path = require("path");
const fs = require('fs');
// ============================================================= 
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

// ============================================================= 
// Sets up the Express app to handle data parsing
// ============================================================= 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let storedNotes =[];
// ============================================================= 
// HTML Get Routes
// =============================================================
// Get the index html from the folder its saved in and serves it to the user
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname +"/public", "index.html"));
  });
 // Gets the notes html from the folder its saved in and serves it to the user
app.get("/notes", function(req, res) {
    //__dirname getes the path of the directory we are in and the path.join adds notes.html to the path
    res.sendFile(path.join(__dirname +"/public", "notes.html"));
  });


// ============================================================= 
//Talking to the Json file
// =============================================================  
// /api/notes path is manally created here. HTML will use this to communicate with the json file
app.get("/api/notes", function(req, res) {
      //opens the json file and holds it in the data variable. Error variable will catch the errors
      fs.readFile(__dirname +"/db/db.json", "utf8", function(error, data) {
        if (error) {
              return console.log(error);
            }
            //contents in the db file is saved as a string. Taking it out, turning it into an array of objects then storing it in the stored notes variable
            storedNotes = JSON.parse(data)
            //returns the json of the storedNotes array when api is called
            res.json(storedNotes)
          });
  });
// ============================================================= 
//post to db.json file
// ============================================================= 
// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    // the body had sample data
    //     opens the json file and holds it in the data variable. Error variable will catch the errors
        fs.readFile(__dirname +"/db/db.json", "utf8",function(error, data){
          if (error) {
            return console.log(error);
          }
              //I a variable to store new notes
              let newNote= req.body
              //setting number to the uniqueID variable. It will use its postion in the array to set the number.The number will be transformed to text
              let uniqueID = (storedNotes.length).toString()
              //extending the id to the newNOte object
              newNote.id = uniqueID
              //printing the string version of the new note
              console.log("this is whats stored in the new note from the req.body "+JSON.stringify(newNote))

              // this will add the new note object to the array
              storedNotes.push(newNote)
              //printing the storedNotes array with the new note added
              console.log("This is the StoredNotes array with the new note added"+ JSON.stringify(storedNotes))
              //responsing to the api call with a json object to browser. This will have the new note. You can only res.json once, becasue this is sending the response to the client 
              res.json(newNote)

              //transforming the stored notes to stringarray as text 
              stringArray = JSON.stringify(storedNotes)
              //saving the the variable to the db.json file
                fs.writeFile(__dirname +"/db/db.json",stringArray, "utf8", function(error, data) {
                  if (error) {
                      return console.log(error);
                    }
                });
                })
              })

// ============================================================= 
// Delete Note from Array
// =============================================================
//random comment
app.delete("/api/notes/:id", function(req, res) {
    //opens the json file and holds it in the data variable. Error variable will catch the errors
    fs.readFile(__dirname +"/db/db.json", "utf8", function(error, data) {
      if (error) {
            return console.log(error);
          }
          //taking the string from the json file and putting it in the stored notes variable
          storedNotes = JSON.parse(data)
          //uses the array method filter to find the object with the id passed through the parmaters
          storedNotes = storedNotes.filter(function(note) {
          //this will return all notes that do not match the id of what was passed in the parmaeters
            return note.id != req.params.id;
          });
          // responds with the remaining notes
          res.json(storedNotes)
          //turnes remaing notes into string to be saved to db.json
          stringArray = JSON.stringify(storedNotes)

          fs.writeFile(__dirname +"/db/db.json",stringArray, "utf8", function(error, data) {
            if (error) {
                  return console.log(error);
                }
            });

        });
          
});

// ============================================================= 
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
