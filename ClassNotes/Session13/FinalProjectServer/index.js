var app = require('express')();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup //////////////////////////////////////////////////////

var hostname = '127.0.0.1'
var port = 8005

var teamNameEnum = Object.freeze({"red": "RED", "blue": "BLUE", "neutral":"NEUTRAL"})
var playersThisRound = {};

var timeUpdateData = {
  "RemainingTimeMinutes": 0,
  "RemainingTimeSeconds": 0,
  "marker01Control": teamNameEnum.neutral,
  "marker02Control": teamNameEnum.neutral,
  "marker03Control": teamNameEnum.neutral,
  "marker04Control": teamNameEnum.neutral,
  "marker05Control": teamNameEnum.neutral
}

var updateTimeInterval = setInterval(function(){
  updateClock();
},1000);

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Routes /////////////////////////////////////////////////////

app.get('/', function(req, res){
  res.send('Hello World!')
});

app.get('/joined/:id/:team', function(req, res) {
  var id = parseInt(req.params.id);
  var team = req.params.team.toUpperCase();

  console.log(id + " joined " + team);

  switch(team) {
    case teamNameEnum.red:
    case teamNameEnum.blue:
      console.log("joined team " + team + "!")
      break;
    default:
      res.send("Error! Could not recognize team: " + team + "<br /> Must be RED or BLUE");
      return;
      break;
  }

  var player = {
    "team": team,
    "score": 0
  }

  if (id in playersThisRound) {
    playersThisRound[id].team = team;
  } else  {
    playersThisRound[id] = player;
  }

  res.send(id + " joined " + team + "!");
});

app.get('/captured/:id/:markerName', function(req, res) {
  var id = parseInt(req.params.id);
  var markerName = req.params.markerName.toLowerCase();

  console.log(id + " captured " + markerName);

  if (markerName !== "marker01" &&
      markerName !== "marker02" &&
      markerName !== "marker03" &&
      markerName !== "marker04" &&
      markerName !== "marker05") {
    res.send("Error! Could not recognize markerName: " + markerName + "<br /> Must be marker01, marker02, marker03, marker04, or marker05!");
    return;
  }

  if (!(id in playersThisRound)) {
    res.send("This player has not yet joined the game! Make sure to join a team before you capture markers");
    return;
  }

  var team = playersThisRound[id].team;
  timeUpdateData[markerName + "Control"] = team;
  playersThisRound[id].score += 1;


  sendMarkerCaptured(markerName, id, team);
  res.send(id + " captured " + markerName + " for team " + team + "!");
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Routes for testing //////////////////////////////////////////

app.get('/status', function(req, res){
  res.send(timeUpdateData);
});

app.get('/players', function(req, res){
  res.send(playersThisRound);
  sortPlayerData();
});

app.get('/end', function(req, res){
  var output = sendGameStatus()
  res.send(output);
});

app.get('/reset', function(req, res){
  res.send("OK");
});

app.get('/testSocket/markerCaptured', function(req, res){
  sendMarkerCaptured('marker01', 1234567, teamNameEnum.red)
  res.send("OK");
});

app.get('/testSocket/gameStatus', function(req, res){
  // sendMarkerCaptured('marker01', 1234567, teamNameEnum.red)
  var gameStatusData =  {
    "status": "OVER",
    "winningTeam": teamNameEnum.red,
    "highScorePlayer": 1234567,
    "highScorePlayerScore": 10000
  }

  io.emit('gameStatusData', gameStatusData);
  res.send(gameStatusData);
});

app.get('/socketTest', function(req, res){
  res.send("<!doctype html><html><head><title>Socket.IO Test</title></head><body><script src='/socket.io/socket.io.js'></script><script>(function () {var socket = io();socket.on('newData', function(msg){var p = document.createElement('p');p.innerText = msg;document.body.appendChild(p);});})();</script></body></html>");
});

app.get('/sendSocketTest', function(req, res){
  io.emit('newData', "Hello!");
  res.send("OK");
});

app.get('/*', function(req, res){
  res.status(400).send('Bad Request');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Socket.io Setup /////////////////////////////////////////////

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions //////////////////////////////////////////////////

function updateClock () {
  var currentTime = new Date();

  var currentMinutes = 59 - currentTime.getMinutes();
  var currentSeconds = 59 - currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  timeUpdateData.RemainingTimeMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  timeUpdateData.RemainingTimeSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // console.log(timeUpdateData);
  io.emit('timeUpdate', timeUpdateData);

  if (currentMinutes === 0) {
    sendGameStatus();
  }
}


function sendGameStatus() {
  var highScore = sortPlayerData();

  var blueTotal = 0;
  var redTotal = 0;
  for (var i = 1; i <=5; i++) {
    if (timeUpdateData["marker0"+i+"Control"] === teamNameEnum.red) {
      redTotal++;
    } else if (timeUpdateData["marker0"+i+"Control"] === teamNameEnum.blue) {
      blueTotal++;
    }
  }

  var winningTeam = "TIE";

  if (blueTotal > redTotal) {
    winningTeam = teamNameEnum.blue;
  } else if (redTotal > blueTotal) {
    winningTeam = teamNameEnum.red;
  }

  var gameStatusData =  {
    "status": "OVER",
    "winningTeam": winningTeam,
    "highScorePlayer": highScore.id,
    "highScorePlayerScore": highScore.score
  }

  return gameStatusData;
  io.emit('gameStatusData', gameStatusData);
  ResetRound();
}

function ResetRound() {
  playersThisRound = {};
  timeUpdateData.marker01Control = teamNameEnum.neutral;
  timeUpdateData.marker02Control = teamNameEnum.neutral;
  timeUpdateData.marker03Control = teamNameEnum.neutral;
  timeUpdateData.marker04Control = teamNameEnum.neutral;
  timeUpdateData.marker05Control = teamNameEnum.neutral;
}

function sendMarkerCaptured(marker, player, team) {
  var currentTime = new Date();

  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  var markerCapturedData = {
    "captured": marker,
    "capturedByTeam": team,
    "capturedByPlayer": player,
    "capturedTimeHours": currentHours,
    "capturedTimeMinutes": currentMinutes,
    "capturedTimeSeconds": currentSeconds
  }

  console.log(markerCapturedData);
  // return markerCapturedData;
  io.emit('markerCaptured', markerCapturedData);
}


function sortPlayerData() {

  var result = Object.keys(playersThisRound).map(function(key) {
    return {"id": Number(key), "score": playersThisRound[key].score, "team": playersThisRound[key].team};
  });

  if (result.length === 0) {
    return {"id": -1, "score": -1, "team": teamNameEnum.neutral};
  }

  result.sort(function(a,b){
    var scoreA = a.score;
    var scoreB = b.score;

    i = 0;
    if (scoreA > scoreB) {
      i = -1;
    } else if (scoreA < scoreB) {
      i = 1;
    }
    return i;
  })

  // console.log(result[0]);
  return result[0];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Launch Server //////////////////////////////////////////////
server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`)
})
