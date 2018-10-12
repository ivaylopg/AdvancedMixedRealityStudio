using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

public class MarkerDetected : MonoBehaviour, ITrackableEventHandler {

  private TrackableBehaviour myTrackableBehaviour;

	void Start () {
    myTrackableBehaviour = GetComponent<TrackableBehaviour>();
    if (myTrackableBehaviour) {
      myTrackableBehaviour.RegisterTrackableEventHandler(this);
    }
	}
	
	void Update () {
		
	}

  public void OnTrackableStateChanged(TrackableBehaviour.Status previousStatus, TrackableBehaviour.Status newStatus) {

    if (newStatus == TrackableBehaviour.Status.TRACKED) {
      Debug.Log("Hey! I found: " + gameObject.name);

      // Example of calling function on a singleton: 
      //ExampleARManager.Instance.MyPublicFunction(gameObject.name);
    }
  }
}
