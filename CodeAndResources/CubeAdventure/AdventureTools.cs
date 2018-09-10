using System.Collections;
using System.Collections.Generic;
using UnityEngine;


/*
 * This script does not need to live on a GameObject! 
 * Here, we define globally available variables and types.
 * Anything we define here is available in any of our other 
 * scripts.
 * 
 * There is nothing special about this file. When Unity compiles
 * our scripts, it (basically) just combines all the text files 
 * into one, so the actual files don't really matter (they do, but
 * we can talk about that later). What **IS** special is that the
 * stuff written here exists _outside_ the brackets of all our other
 * classes, so it is public and visibale to all of them.
 */


////////////////////////////////////////////////////////////
// SpellEventArgs extends (inherits from) System EventArgs
// This is where we define the "data packet" we want our
// "Spell" event to have. Extending from System.EventArgs
// provides the magic we need to use this as an event,
// and then we define variables in here that we want to pass
// along through the event.
public class SpellEventArgs : System.EventArgs {
  public int strength;
  public float spellRange;
  public Vector3 pos;
}


////////////////////////////////////////////////////////////
// An enum is a datatype (short for "enumarable") that we can
// define to help us name things. Instead of using ints and
// having to remember that 1 means Adventurer, 2 means wizard,
// etc., we can just use actual words that we define here.
public enum CharacterType {
  Adventurer,
  Wizard,
  Mage,
  Rogue
}



////////////////////////////////////////////////////////////
// We covered this pretty quicklu in class. Don't worry if you
// don't quite see how or why this is actually useful yet, but
// just know that an 'interface' is a type of object we can define
// that allows us to standardize code.
//
// In this case, we're saying that anything that wants to call itself
// a 'SpellReceiver' has to have a function inside of it called
// 'SpellCastEventReceived' that takes an 'object' parameter and a 
// 'SpellEventArgs' parameter.
public interface SpellReceiver {
  void SpellCastEventReceived(object sender, SpellEventArgs e);
}
