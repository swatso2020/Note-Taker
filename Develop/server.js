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
var PORT = 3000;

// ============================================================= 
// Sets up the Express app to handle data parsing
// ============================================================= 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let storedNotes =[];
// ============================================================= 
// HTML Get Routes
// =============================================================
// Get the index html from the folder its saved in and serves it to the user
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });
 // Gets the notes html from the folder its saved in and serves it to the user
app.get("/notes", function(req, res) {
    //__dirname getes the path of the directory we are in and the path.join adds notes.html to the path
    res.sendFile(path.join(__dirname, "notes.html"));
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
            //reads data from json file and turns it in JS object. A js Object is needed to be interpreted by the browser
            storedNotes = JSON.parse(data)
            //prints result from json file in the node cli
            console.log(storedNotes);
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
        //opens the json file and holds it in the data variable. Error variable will catch the errors
        fs.readFile(__dirname +"/db/db.json", "utf8", function(error, data) {
            if (error) {
                  return console.log(error);
                }
                //reads data from json file and turns it in JS object. A js Object is needed to be interpreted by the browser
               // storedNotes = JSON.parse(data)
                
             
                //set id for new notes
                req.body.id = storedNotes.length;
                //stores data from the body of the browser or postman request
                var newNote = req.body;
                //prints newly added note to the node cli
                    console.log("this is before the newNote variable")
                    console.log(newNote);
                // We then display the JSON to the users
                res.json(newNote);
                storedNotes.push(newNote)
                console.log("this is before the stored note array")
                console.log(storedNotes)
                console.log("this is before the strify")
                stringNote = JSON.stringify(newNote)
                console.log(stringNote)
                console.log("This is before the string array")
                stringArray = JSON.stringify(storedNotes)
                console.log(stringArray)
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
