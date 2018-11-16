using System;
using UnityEngine;

// Remember to import the Unity Package I sent in class
// See me if you need the link again (can't put it on github)
using BestHTTP;
using BestHTTP.SocketIO;

public class SocketIOExample : MonoBehaviour {

  // Create a variable to hold an instance of the SocketManager class
  SocketManager socketManager;

  // Public variables so you can change the address and port in the inspector
  public string socketServerAddress = "localhost";
  public int port = 3000;

  void Start () {
    // Create the address string from the variables above
    string socketAddr = "http://" + socketServerAddress + ":" + port.ToString() + "/socket.io/:8443";
    Debug.Log("Connecting to: " + socketAddr);

    // Create a new instance of the SocketManager class by passing it a URI
    // created from the socketAddr string
    Uri uri = new Uri(socketAddr);
    socketManager = new SocketManager(uri);

    // Make sure that we are responsible for decoding the incoming JSON
    socketManager.Socket.AutoDecodePayload = false;

    // set up listeners for socket.io by passing a name and the name of
    // a function (without parenthesis!) that you have defined below
    socketManager.Socket.On("mySocketEvent", ReceivedMySocketEvent);

    // Same as above, except these are existing named events that socket.io can emit
    socketManager.Socket.On("error", SocketError);
    socketManager.Socket.On("connect", SocketConnected);
    socketManager.Socket.On("reconnect", SocketConnected);
  }


  void ReceivedMySocketEvent(Socket socket, Packet packet, params object[] args) {
    string eventName = packet.DecodeEventName();
    string eventPayload = packet.RemoveEventName(true);
    Debug.Log(eventName);
    Debug.Log(eventPayload);

    // eventName will be the name of the event that triggered this function (in this
    // case it will be 'mySocketEvent' because we defined this function to listen to
    // that event on line 38)
    //
    // eventPayload will be the 'msg' parameter that your node.js server sends. This will
    // always be interpretted as a string. If you need to decode JSON, take a look at
    // ClickToCommunicate.cs from Session 11 for an example.
  }

  public void SendSomeData(string dataString) {
    socketManager.Socket.Emit("myOutgoingData", dataString);
  }

  // Very important! Make sure you close the socket connection when your program
  // closes or quits!
  //void OnApplicationQuit() { socketManager.Close(); }
  //void OnError() { socketManager.Close(); }
  void OnApplicationQuit() {
    Debug.Log("Closing Socket");
    socketManager.Close(); 
  }

  // The functions below simply print helpful debug stuff in the event of
  // errors and connections.
  void SocketConnected(Socket socket, Packet packet, params object[] args) {
    Debug.Log(DateTime.Now + " - " + "Success connecting to sockets");
  }

  void SocketError(Socket socket, Packet packet, params object[] args) {
    Debug.LogError(DateTime.Now + " - " + "Error connecting to sockets");

    // Do something in error event

    if (args.Length > 0) {
      Error error = args[0] as Error;
      if (error != null) {
        switch (error.Code) {
          case SocketIOErrors.User:
            Debug.LogError("Exception in an event handler!");
            break;
          case SocketIOErrors.Internal:
            Debug.LogError("Internal error!");
            break;
          default:
            Debug.LogError("Server error!");
            break;
        }
        Debug.LogError(error.ToString());
        return;
      }
    }
    Debug.LogError("Could not Parse Error!");
  }
}
