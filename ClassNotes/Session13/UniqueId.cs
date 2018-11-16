using UnityEngine;

public class UniqueId : MonoBehaviour {

  const string key = "playerId";

  private int playerId;
  public int PlayerId {
    get {
      return playerId;
    }
  }

  // Let's make this a singleton so we can get the ID from anywhere
  // with: UniqueId.Instance.playerId
  // Singleton Setup ----------------------------------------------
  private static UniqueId _instance = null;
  public static UniqueId Instance {
    get {
      return _instance;
    }
  }

  void Awake() {
    if (_instance == null) {
      _instance = this;
    } else if (_instance != this) {
      Destroy(this);
    }
  }
  // End Singleton Setup ------------------------------------------

  void Start () {
    if (PlayerPrefs.HasKey(key)) {
      playerId = PlayerPrefs.GetInt(key);
      Debug.Log("Loaded playerID: " + playerId);
    } else {
      CreateID();
    }
	}
	
  void CreateID() {
    playerId = System.Guid.NewGuid().GetHashCode();
    Debug.Log("Created unique playerID: " + playerId);
    PlayerPrefs.SetInt(key, playerId);
  }
}
