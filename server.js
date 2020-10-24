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
           
            console.log(data)
            //reads data from json file and turns it in JS object. A js Object is needed to be interpreted by the browser
            storedNotes = JSON.parse(data)
            console.log(storedNotes);
            req.body.id = storedNotes.length;

            //prints result from json file in the node cli
            
            //posts json file to browser and postman
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
             //printing contents of  db file to text editor console 
            console.log(data)
            //storing contents of db file to storedNotes array and turining it into an object
            storedNotes = JSON.parse(data)
              //responding with the a json object that has the contents of the db file  shows in the browser
              
              //Turning the db file object into a text string so it can be console.log
              console.log("This is the turning the stored notes object into a string:"+JSON.stringify(storedNotes))
              //I a variable to store new notes
              let newNote= req.body
              //setting the newNote object to store req.body
            
             
              //printing the string version of the new note
              console.log("this is whats stored in the new note from the req.body "+JSON.stringify(newNote))

              // I want new notes to added to the storedNotes array
              storedNotes.push(newNote)
              //printing the storedNotes array with the new note added
              console.log("This is the StoredNotes array with the new note added"+ JSON.stringify(storedNotes))
              //responsing to the api call with a json object to browser. This will have the new note. You can only res.json once, becasue this is sending the response to the client 
              res.json(newNote)

              stringArray = JSON.stringify(storedNotes)
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
          storedNotes = JSON.parse(data)
          storedNotes = storedNotes.filter(function(note) {
            return note.id != req.params.id;
          });
          res.json(storedNotes)
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
