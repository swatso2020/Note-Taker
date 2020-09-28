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
        fs.readFileSync(__dirname +"/db/db.json", "utf8",function(error, data){
            storedNotes = JSON.parse(data)
             if (error) {
                  return console.log(error);
                }
        })        
                //stores data from the body of the browser or postman request
                var newNote = req.body;

                //set id for new notes
                let uniqueID = (storedNotes.length).toString();
                newNote.id = uniqueID;

                   //prints newly added note to the node cli
                    console.log("this is the note you added db.json. Content  ")
                    console.log(newNote);

                // We then display the JSON to the users
                    res.json(storedNotes);
                //pushes the new note from postman body or user input
                storedNotes.push(newNote)
                console.log(storedNotes)

                
                stringArray = JSON.stringify(storedNotes)
                console.log(stringArray)
                fs.writeFile(__dirname +"/db/db.json",stringArray, "utf8", function(error, data) {
                    if (error) {
                          return console.log(error);
                        }
                    }); 
});
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

          res.json(storedNotes)
        });
          //reads data from json file and turns it in JS object. A js Object is needed to be interpreted by the browser
          storedNotes = JSON.parse(data)
          //prints result from json file in the node cli
          console.log(storedNotes);
          storedNotes = storedNotes.filter(function(note) {
            return note.id != req.params.id;
          });
          // make it string(stringify)so you can write it to the file
          notesData = JSON.stringify(notesData);
          // write the new notes to the file
          fs.writeFile("./db/db.json", notesData, "utf8", function(err) {
            // error handling
            if (err) throw err;
          });
          //posts json file to browser and postman
          
});

// ============================================================= 
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
