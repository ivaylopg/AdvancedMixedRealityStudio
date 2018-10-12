using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/* SINGLETONS are a pattern used in Object Oriented Programing
 * when you want to ensure that you have only ONE instance of a
 * particular class.
 *
 * This is useful because:
 *    1. It avoids conlicts from accidentally creating two copies of
 *       a class (it would be bad to have two character controllers,
 *       for example)
 *
 *    2. It allows us to have a static reference to this class instance,
 *       which we can reference from all of our other scripts.
 *
 *       For example: UnitySingletonExample.Instance.MyPublicFunction("hello!");
 */

public class UnitySingletonExample : MonoBehaviour {

  // Singleton Setup ----------------------------------------------
  private static UnitySingletonExample _instance = null;
  public static UnitySingletonExample Instance {get { return _instance;}}

  void Awake() {
    if (_instance == null) {
      _instance = this;
    } else if (_instance != this) {
      Destroy(this);
    }
  }
  // End Singleton Setup ------------------------------------------

  void Start () {

	}


	void Update () {

	}

  public void MyPublicFunction(string s) {
    Debug.Log(s);
  }
}
