/*
 * This is the basic, boilerplate node.js webserver
 *
 * Make sure you've installed node.js: https://nodejs.org/en/ (Use the LTS release)
 *
 * Open up TERMINAL on your mac/linux computer, or POWERSHELL on your Windows computer.
 *    - Navigate to place where you want to create your project (perhaps a new folder)
 *    - type "npm init" (minus the quotes) to create a new project.
 *    - Keep pressing ENTER to accept all the default values and confirm the new project.
 *       - This will create a package.json file, which keeps track of your project settings,
 *         such as which libraries you bring in.
 *
 * Copy THIS FILE into the same directory you just used to init the new project.
 *
 * Back in your terminal/shell, type "node index.js" (minus the quotes)
 *
 * You should now be able to go to your browser and type "http://localhost:3000" and see the output of your server
 *
 * Back in your terminal/shell, you can hit `CTRL-C` to stop the node server.
 */

////////////////////////////////////////////////

// The "require()" function is just like the "using" keyword we use in C#
// In this case, we are using a built-in module called 'http' (https://nodejs.org/api/http.html)
// We are assigning it to a variable called http so we can use it later.
var http = require('http')

// Define the address and port that your app will run on
// 127.0.0.1 is an IP address that means "this comuter that I am
// currently on". This is the same thing as "localhost".
//
// You can pick whatever port you want, but keep in mind that many
// ports are already taken. Stuff in the 3000 range should be prety good
var hostname = '127.0.0.1'
var port = 3000

// Now we are creating a webserver object that we will store in a variable
// called 'server' using method from the http library called 'Server'.
// (https://nodejs.org/api/http.html#http_class_http_server)
//
// This is why we stored the output of 'require('http')' into a variable earlier.
// That let's us actually use the http module by calling its properties and methods
//
// The Server() function takes one argument: a callback function which itself takes
// two arguments: req (aka request) and res (aka response)
var server = http.Server(function(req, res) {

  // inside this function, we can do whatever we want, but most importantly
  // we can work with the res (response)
  //
  // We can call the 'end()' method to send back the response with
  // whatever we pass as an argument.
  res.end('Hello World!')
})


// Finally, we need to call the 'listen()' method on our new server object
// (https://nodejs.org/api/net.html#net_server_listen)
// Listen takes three arguments: a port, a hostname, and a callback function
// Here, we are just using the callback function to print a confirmation to our terminal
server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`)
})
