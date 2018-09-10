using System.Collections;
using System.Collections.Generic;
using UnityEngine;


// We put this class on anything that we want to be affected by our
// Spell event. Notice the 'SpellReceiver' at the end of the class
// declaration. This is saying that this class will implement the
// interface 'SpellReceiver' that we defined in AdventureTools.cs.
// This means that this class MUST implement a function 
// called SpellCastEventReceived();
public class SpellListener : MonoBehaviour, SpellReceiver {

  // reference to our event emitter
  private Adventure spellCaster;

	void Start () {
    spellCaster = GameObject.Find("InternetExplorer").GetComponent<Adventure>();

    // This is where the magic happens. Any function that we have that takes
    // the correct parameters can subscribe to the event using +=. In this case,
    // the first parameter is `object` (this will ALWAYS be the first parameter),
    // and `SpellEventArgs` because that is the type of event args that we declared
    // SpellCast with in Adventure.cs.
    //
    // Note that you don't put the () parenthesis here. We are not calling this
    // function. We are adding it (by name) to the event.
    spellCaster.SpellCast += SpellCastEventReceived;
	}
	
	void Update () {
		
	}

  // The function that gets called when the event is sent.
  public void SpellCastEventReceived(object sender, SpellEventArgs e) {

    // Once we're in here, the code is basically the same as the OLD version 
    // in Adventure.cs

    float distance = Vector3.Distance(transform.position, e.pos);

    if (distance <= e.spellRange) {
      Vector3 dir = transform.position - e.pos;
      dir.Normalize();

      gameObject.GetComponent<Rigidbody>().AddForce(dir * e.strength + Vector3.up * e.strength, ForceMode.Impulse);
      gameObject.GetComponent<Renderer>().material.color = Color.red;
    }
  }


  // When we register something to be a listener on an event, it is
  // VERY important that we de-register when we don't need it anymore,
  // such as when that listener is destroyed. Otherwise, we have a memory
  // leak and we are sad programmers that have to stay up late fixing things
  private void OnDestroy() {
    spellCaster.SpellCast -= SpellCastEventReceived;
  }
}
