var prefs = require("../preferences.js");

exports["testing on_pref_change"] = function(assert, done){

  prefs.SPref.init();
  
  if(prefs.SPref.check_installation() != 0){
  
    assert.equal(true, false, "[!] ShadowPref check_installation() failed - something is really wrong...");
    done();
  
  }
  
  prefs.SPref.add("test_pref", "", "test_our_value", true, 0);
  
  if(prefs.SPref.important_prefs[prefs.SPref.important_prefs.length-1][1] != "" || prefs.SPref.important_prefs[prefs.SPref.important_prefs.length-1][2] != "test_our_value"){
  
    assert.equal(true, false, "[!] ShadowPref add() failed.");
    done();
  
  }
  
  if(prefs.SPref.getSPValue("test_pref", 0) != "" || prefs.SPref.getSPValue("test_pref", 1) != "test_our_value"){
  
    assert.equal(true, false, "[!] ShadowPref getSPValue() failed.");
    done();
  
  }
  
  prefs.SPref.setSPValue("test_pref", 0, "test_user_value");
  
  if(prefs.SPref.getSPValue("test_pref", 0) != "test_user_value"){
  
    assert.equal(true, false, "[!] ShadowPref setSPValue() failed.");
    done();
  
  }
  
  //more needs to be added here
  
  assert.equal(true, true, "[i] ShadowPrefs are working!");
  done();
  
}

require("sdk/test").run(exports);