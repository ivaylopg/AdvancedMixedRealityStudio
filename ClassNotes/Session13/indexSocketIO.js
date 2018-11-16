/*
 * This is a basic socket.io server example using node.js and Express for routing
 *
 * If you haven't already, take a look at index.js and indexApi.js before this file.
 *
 * --------------------------- RECAP ---------------------------
 * Make sure you've installed node.js: https://nodejs.org/en/ (Use the LTS release)
 *
 * Open up TERMINAL on your mac/linux computer, or POWERSHELL on your Windows computer.
 *    - Navigate to place where you want to create your project (perhaps a new folder)
 *    - type "npm init" (minus the quotes) to create a new project.
 *    - Keep pressing ENTER to accept all the default values and confirm the new project.
 *       - This will create a package.json file, which keeps track of your project settings,
 *         such as which libraries you bring in.
 *    - type "npm install --save express" (minus the quotes) to install the Express library.
 *
 * -------------------------------------------------------------
 *
 * Copy THIS FILE into the same directory you just used to init the new project.
 *
 * Back in your terminal/shell, type "npm install --save socket.io" (minus the quotes)
 * to install the socket.io library.
 *
 * Type "node indexSocketIO.js" (minus the quotes)
 *
 * You should now be able to go to your browser and type "http://localhost:3000" and see the output of your server
 *
 * Back in your terminal/shell, you can hit `CTRL-C` to stop the node server.
 */


// The "require()" function is just like the "using" keyword we use in C#
// In this case, we are using a NON BUILT-IN built-in module. Make sure
// you install it with: "npm install --save express"
//
// Note the () parenthesis after require('express'). We are importing 'express' and
// then immediately initializing it, and the assigning THAT to the variable called 'app'
//
// This is the exact same as:
//
// var express = require('express')
// var app = express();
//
// However, since we never need to use 'exress' except for when we call its master function,
// this version saves us from having an extra variable lying around:
var app = require('express')();

// This is the same as before
var http = require('http');


// In the simple example, we started a server by passing an anonymous function in
// to http.Server():
//      var server = http.Server(function(req, res) {
//        res.end('Hello World\nI\'m here for you now!')
//       })
//
// Now, we are just pasing the 'app' variable into http.Server()
var server = http.Server(app);


// Now we're adding socket.io to our project.
// Again, this is a NON BUILT-IN built-in module. Make sure
// you install it with: "npm install --save socket.io"
//
// Just like when we required express, here we have the same () parenthesis
// after require('socket.io') representing that we're calling this as a function.
//
// In this case, we are passing the 'server' variable as an argument to this function.
var io = require('socket.io')(server);



// Just like before:
// Define the address and port that your app will run on
// 127.0.0.1 is an IP address that means "this comuter that I am
// currently on". This is the same thing as "localhost".
//
// You can pick whatever port you want, but keep in mind that many
// ports are already taken. Stuff in the 3000 range should be prety good
var hostname = '127.0.0.1'
var port = 3000


// Variables in JavaScript can be Objects (actually, EVERYTHING in JavaScript
// is an object). This is an example Object using JSON
// (JavaScript Object Notation - https://developers.squarespace.com/what-is-json)
var dataObject = {
  "status":"OK",
  "amount": 123,
  "cost": 12.45
}


// Express lets us define "routes"
// you can create a new route for a GET request using:
// app.get(<ROUTE>, <FUNCTION>)
//
// The route is a string that has to start with '/', which is the root of your app
// The function is the same as what we passed into Server() before: a function which itself takes
// two arguments: req (aka request) and res (aka response)

// This is the Root route for our app
app.get('/', function(req, res){
  // note that we are using res.send here instead of res.end (note the extra S)
  res.send('Hello World!')
});

// This is another route for our app. In this case it's http://localhost:3000/someOtherRequest
app.get('/someOtherRequest', function(req, res){
  // instead of a string, here we are sending a JSON object
  res.send(dataObject)
});


// Here's where it gets more interesting! Using the colons, we can create slots in our
// routes that are filled-in with whatever our users type, as long as it fits the pattern.
//
// In this case, our users could go to:
//    http://localhost:3000/addTwo/12/6
//    http://localhost:3000/addTwo/foo/bar
//    http://localhost:3000/addTwo/34px/54.4inches
// But NOT:
//    http://localhost:3000/addTwo
//    http://localhost:3000/addTwo/12
//    http://localhost:3000/addTwo/hello

app.get('/addTwo/:num1/:num2', function(req, res) {
  // here we create a variables called num1 and num2 and assign them the
  // values of whatever our user typed in the url
  // Note that we are using parseFloat() to make sure the value comes back
  // as a number if possible
  var num1 = parseFloat(req.params.num1);
  var num2 = parseFloat(req.params.num2);

  // Log the request to the terminal, just for fun
  console.log("Num1: %d, Num2: %d ", num1, num2);

  // create a new object
  var responseData = {
    "num1": num1,
    "num2": num2,
    "result": num1 + num2
  }

  // and send it back to the user!
  res.send(responseData);
});



// Here we have a route that will call a function every time
// it receives a request
app.get('/triggerSomething', function(req, res){

  // This function gets called when `/triggerSomething` receives a request
  sendDataToAllSockets();

  // Don't forget you still need to send SOMETHING back to the request, or else
  // the client will keep waiting until it times out. In this case, we're just
  // sending a string that says "OK"
  res.send("OK");
});


////////// TEST ///////////
// Here we've created a route that sends up some HTML so we can test our
// socket.io server. If you go to this route in your browser (http://localhost:3000/socketTest)
// and then in a DIFFERENT browser window, every time you go to http://localhost:3000/sendSocketTest
// you should see a change in your first window
app.get('/socketTest', function(req, res){
  res.send("<!doctype html><html><head><title>Socket.IO Test</title></head><body><script src='/socket.io/socket.io.js'></script><script>(function () {var socket = io();socket.on('newData', function(msg){var p = document.createElement('p');p.innerText = msg;document.body.appendChild(p);});})();</script></body></html>");
});

// See the comment above. This helps us test if our socket.io server is working
app.get('/sendSocketTest', function(req, res){
  io.emit('newData', "Hello!");
  res.send("OK");
});
///////////////////////////



// Finally we can also create a catch-all route. If the user types ANYTHING that
// isn't captured by our routes, this block will take it.
app.get('/*', function(req, res){
  res.status(400).send('Bad Request');
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here is where we define all of our socket.io logic


// Whenever somebody connects to our socket.io server (which we stored under
// the variable name 'io' on line 70), the server will establish a socket to
// that client emit an event named 'connection'.
//
// io.on('connection', function(socket) {})
// This basically translates to "when you hear the 'connection' event, execute
// this function. Here is a copy of the specific socket to this client that you can do
// stuff with/to"
io.on('connection', function(socket){
  console.log('a user connected');

  // Everything below will now get added to the specific socket that has been
  // opened, and will execute when the appropriate event fires.

  // Here we are saying when this socket emits the 'disconnect' event, do something.
  // In this case, we're just printing that the socket disconnected.
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // Here we're listening for an event called 'updatePosData'...
  socket.on('updatePosData', function(msg) {
    // ...logging its message...
    console.log(msg);
    // ...and then emiting it to all connected sockets. The specifics of this next
    // line have to do with the unity example we did in class. See me if you have
    // any questions.
    //
    // Specifically, the 'volatile' word here is useful if we will be sending lots
    // of data very quickly, such as position data every few frames.
    io.volatile.emit('newPosData', JSON.parse(msg));
  })
});

// A function that we can call from anywhere
function sendDataToAllSockets() {
  // creating a new object
  var sampleData = {
    "parameter1": 1,
    "parameter2": 2,
    "parameter3": 3
  }

  // sending that object to all socket.io clients
  io.emit('newJsonData', sampleData);
}


// Same as before:
// Finally, we need to call the 'listen()' method on our new server object
// (https://nodejs.org/api/net.html#net_server_listen)
// Listen takes three arguments: a port, a hostname, and a callback function
// Here, we are just using the callback function to print a confirmation to our terminal
server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`)
})
