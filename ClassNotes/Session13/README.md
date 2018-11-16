# Final Project Requirements

## Unity
Your Unity AR scene will use Vuforia to recognize 5 _unique_ markers (your choice!)
- These markers **MUST** be named _marker01_ through _marker05_ (case sensitive!)
    - Take a look at [MarkerDetected.cs](https://github.com/ivaylopg/AdvancedMixedRealityStudio/blob/master/CodeAndResources/VuforiaExamples/MarkerDetected.cs) to remember how to get name of a marker's game object.

Your Unity projects will need to:
- Generate and save a unique ID for each user. 
    - Take a look at [UniqueId.cs](https://github.com/ivaylopg/AdvancedMixedRealityStudio/blob/master/ClassNotes/Session13/UniqueId.cs)
- Ask user to join a team
    - **Extra credit 01**: Users only get asked once per game (for example, if I open the app and join a team, it will _not_ ask me again if I close and re-open the app before the current game is over).
- Once they have joined, send ID and team choice to: `http://ar.pixels-pixels.com/joined/:id/:team`
- The only valid team names are `RED` and `BLUE` (case sensitive!)
    - **Remember**: `:xxxx` is a placeholder for a variable in our API routes. For example, you will actually send something like: _http://ar.pixels-pixels.com/joined/12345/RED_
- Each time they capture a marker, send marker name to: `http://ar.pixels-pixels.com/captured/:id/:markerName`
    - Take a look at [MarkerDetected.cs](https://github.com/ivaylopg/AdvancedMixedRealityStudio/blob/master/CodeAndResources/VuforiaExamples/MarkerDetected.cs) to remember how to get name of a marker's game object
- Display some sort of AR content to indicate that the players has captured a marker
    - **Extra Credit 02:** Display something different if player is capturing a neutral marker, capturing from opposing team, or has just scanned a marker that already belongs to them.
    - **Extra Credit 03:** Display current status of marker while players have to focus on marker for _5 seconds_ in order to capture it 
- Listen for socket events:
    - on `markerCaptured`, receive _MarkerCapturedData_ and display information to the user
    - on `gameStatus`, receive _gameStatusData_ and display information to the user
    - on `timeUpdate`, receive and process _TimeUpdateData_ to update game clock and get the current status of all markers

### Note:
To test any of the above socket events, from any web browser, go to:
- `http://ar.pixels-pixels.com/testSocket/markerCaptured`
- `http://ar.pixels-pixels.com/testSocket/gameStatus`
`timeUpdate` will automatically send updates every second to all connected sockets.

The full code of the server running at `http://ar.pixels-pixels.com` is copied [here](https://github.com/ivaylopg/AdvancedMixedRealityStudio/tree/master/ClassNotes/Session13/FinalProjectServer).    
You can download and run this locally to test! This way you will see the errors and console output on the node.js side as well!

---
# JSON Object Definitions
These are the JSON objects that your app will receive over socket.io

### MarkerCapturedData
```json
{
    "captured": "markerName",
    "capturedByTeam": "<RED or BLUE>",
    "capturedByPlayer": "<playerIDGoesHere>",
    "capturedTimeHours": 0-23,
    "capturedTimeMinutes": 0-59,
    "capturedTimeSeconds": 0-59
}
```


### TimeUpdateData
```json
{
    "RemainingTimeMinutes": 0-59,
    "RemainingTimeSeconds": 0-59,
    "marker01Control": "<NEUTRAL or RED or BLUE>",
    "marker02Control": "<NEUTRAL or RED or BLUE>",
    "marker03Control": "<NEUTRAL or RED or BLUE>",
    "marker04Control": "<NEUTRAL or RED or BLUE>",
    "marker05Control": "<NEUTRAL or RED or BLUE>"
}
```


### GameStatusData
```json
{
    "status": "OVER",
    "winningTeam": "<RED or BLUE or TIE>",
    "highScorePlayer": "<playerIDGoesHere>",
    "highScorePlayerScore": 0
}
```


