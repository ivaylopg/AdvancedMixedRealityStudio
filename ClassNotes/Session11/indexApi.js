/*
 * This is a basic API server example using node.js and Express for routing
 *
 * If you haven't already, take a look at index.js before this file.
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
 *
 * -------------------------------------------------------------
 *
 * Copy THIS FILE into the same directory you just used to init the new project.
 *
 * Back in your terminal/shell, type "npm install --save express" (minus the quotes)
 * to install the Express library.
 *
 * Type "node indexApi.js" (minus the quotes)
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


// We can also create a catch-all route. If the user types ANYTHING that
// isn't captured by our routes, this block will take it.
app.get('/*', function(req, res){
  res.status(400).send('Bad Request');
});


// Same as before:
// Finally, we need to call the 'listen()' method on our new server object
// (https://nodejs.org/api/net.html#net_server_listen)
// Listen takes three arguments: a port, a hostname, and a callback function
// Here, we are just using the callback function to print a confirmation to our terminal
server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`)
})
