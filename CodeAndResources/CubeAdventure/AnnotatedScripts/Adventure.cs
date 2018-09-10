using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

// This is the class we put on our main character
public class Adventure : MonoBehaviour {

  // We know we want our character to send out an event
  // everytime a spell is cast, so we declare a public event
  // of the type 'SpellEventArgs' that we defined in
  // AdventureTools.cs
  //
  // Events must have a type, and that type has to be
  // something that inherits from System.EventArgs
  public event EventHandler<SpellEventArgs> SpellCast;


  // A variable to hold an instance of the enum we declared
  // in AdventureTools.cs
  // unity knows how to deal with enum's, so this shows up 
  // as a very convenient menu in the inspector.
  public CharacterType charType = CharacterType.Adventurer;


  private Rigidbody rb;
  public float moveSpeed = 1f;
  public float spellRange = 10f;

	void Start () {
    rb = GetComponent<Rigidbody>();

    // inside Start(), we change the color of our character based on 
    // the CharacterType
    switch (charType) {
      case CharacterType.Adventurer:
        gameObject.GetComponent<Renderer>().material.color = Color.red;
        break;
      case CharacterType.Mage:
        gameObject.GetComponent<Renderer>().material.color = Color.blue;
        break;
      case CharacterType.Rogue:
        gameObject.GetComponent<Renderer>().material.color = Color.green;
        break;
      case CharacterType.Wizard:
        gameObject.GetComponent<Renderer>().material.color = Color.black;
        break;
      default:
        gameObject.GetComponent<Renderer>().material.color = Color.yellow;
        break;
    }
	}

  void CastSpell() {

    // This is the old/inflexible way of casting a spell, where
    // our character has to loop through all the objects they are
    // affecting. In this case, we only can affect things that 
    // are tagged 'Bean'

    /*
    GameObject[] stuff = GameObject.FindGameObjectsWithTag("Bean");

    //for (int i = 0; i < stuff.Length; i++) {
    //  GameObject g = stuff[i];
    //}

    foreach (GameObject g in stuff) {

      float distance = Vector3.Distance(transform.position, g.transform.position);

      if (distance <= spellRange) {
        Vector3 dir = g.transform.position - transform.position;
        dir.Normalize();

        g.GetComponent<Rigidbody>().AddForce(dir * 3 + Vector3.up * 2, ForceMode.Impulse);

        g.GetComponent<Renderer>().material.color = Color.red;
      }
    }
    */



    // This is the new way! We create an instance of a new
    // SpellEventArgs (Just like we create a new Vector3, with the
    // 'new' keyword.
    //
    // Then we set the varibales to the info that we want to send...
    SpellEventArgs spellInfo = new SpellEventArgs();
    spellInfo.strength = 4;
    spellInfo.spellRange = spellRange;
    spellInfo.pos = transform.position;

    // ...and as long as our event isn't null (as long as it has
    // at least one listener), then we call the event and it 
    // sends to all the listeners. 
    //
    // Take a look at SpellListener.cs to see how we register a
    // listener.
    //
    // Also, notice that the function call to an event takes two 
    // arguments: the first one is the object that _called_ the event,
    // which is 'this' in this case, and the second argument is
    // an instance of the **type** of the event (in this case
    // SpellEventArgs)
    if (SpellCast != null) {
      SpellCast(this, spellInfo);
    }
  }

  // We put our physics-based movement code here
	void Update () {
    if ( Input.GetKey("w") ) {
      rb.AddForce(transform.forward * moveSpeed, ForceMode.Impulse);
    } else if (Input.GetKey("a")) {
      rb.AddForce(transform.right * -1 * moveSpeed, ForceMode.Impulse);
    } else if (Input.GetKey("s")) {
      rb.AddForce(transform.forward * -1 * moveSpeed, ForceMode.Impulse);
    } else if (Input.GetKey("d")) {
      rb.AddForce(transform.right * moveSpeed, ForceMode.Impulse);
    }

    if (Input.GetKeyDown("c")) {
      CastSpell();
    }
  }
}
