using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Make sure to import UnityEngine.Networking
using UnityEngine.Networking;


// Because we are expecting a JSON response, we have to create a new
// class with the same structure as what we're expecting so that
// we can conver from JSON --> C# data
//
// This can be in a separate documeent, anywhere in your project. I've
// added it here just to keep things concise

// Make sure you add this attribute to your class: [System.Serializable]
[System.Serializable]
public class ApiResponse {
  public float num1;
  public float num2;
  public float result;
}


// The actual MonoBehaviour script starts here!

public class ClickToCommunicate : MonoBehaviour {

	// Use this for initialization
	void Start () {

	}

	// Update is called once per frame
	void Update () {

	}

  // I'm calling this from OnMouseDown(), but you can call it from everywhere.
  // What you'd like to avoid though is calling this on EVERY FRAME
  void OnMouseDown() {
    Debug.Log("I've been clicked!");

    // This is where we initiate the request. Since our function is a
    // Coroutine (more info on that below), we have to wrap the whole thing
    // in StartCoroutine(....)
    StartCoroutine(GetRequest("http://localhost:3000/addTwo/12/6"));
  }

  // When you use the IEnumerator return type, you are creating a function that
  // can be a Coroutine.
  //
  // What are Coroutines?????
  // "It is a function declared with a return type of IEnumerator and with the
  // yield return statement included somewhere in the body. The yield return line
  // is the point at which execution will pause and be resumed the following frame".
  //
  // Huh?
  // It's basically a function that can release, or yield, control back to the
  // rest of the program until it is ready. In this case, we make a web request
  // and say to Unity, "Hey dude, keep doing what you're doing and get back to me
  // after I let you know that this server has responded"
  IEnumerator GetRequest(string url) {

    // Create a new UnityWebRequest and give it the URL as an argument
    UnityWebRequest uwr = UnityWebRequest.Get(url);

    // Here, yield is like a return type statement where execution gets stopped
    // and goes back to the function where it was invoked. Once it's reeady, it
    // comes back to a point from where it left the execution and starts executing next lines.
    yield return uwr.SendWebRequest();

    // Check if there was an error
    if (uwr.isNetworkError) {
      Debug.Log("Error While Sending: " + uwr.error);
    } else {

      // Otherwise print the response
      Debug.Log("Received: " + uwr.downloadHandler.text);

      // And send it to the next funciton as an argument
      DoSomethingWithResult(uwr.downloadHandler.text);
    }
  }

  // This function takes the string response as an argument
  void DoSomethingWithResult(string s) {
    // Here we are using Unity's built-in JSON Utility to convert
    // the JSON into the class we created earlier. This is why we need
    // to create a class that matches the structure of the response,
    // or else the Utility won't know what to do!
    ApiResponse res = JsonUtility.FromJson<ApiResponse>(s);

    // Now we can access the data:
    Debug.Log(res.result);
  }
}
