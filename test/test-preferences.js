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
  
  if(require("sdk/preferences/service").get(prefs.SPref.important_prefs[7][0]) != prefs.SPref.getSPValue(prefs.SPref.important_prefs[7][0], 0)){
  
    assert.equal(true, false, "[!] ShadowPref getCurrUserVal() failed.");
    done();
  
  }
  
  prefs.SPref.install();
  
  if(require("sdk/preferences/service").get("extensions.jondofox.test_pref") != prefs.SPref.getSPValue("test_pref", 1)){
  
    assert.equal(true, false, "[!] ShadowPref install() failed.");
    done();
  
  }
  
  prefs.SPref.setSPValue("test_pref", 1, "test_our_new_value");
  prefs.SPref.fix_missing(false);
  
  if(require("sdk/preferences/service").get("extensions.jondofox.test_pref") == "test_our_new_value"){
  
    assert.equal(true, false, "[!] ShadowPref fix_missing() failed!");
    done();
  
  }
  
  prefs.SPref.fix_missing(true);
  
  if(require("sdk/preferences/service").get("extensions.jondofox.test_pref") != "test_our_new_value"){
  
    assert.equal(true, false, "[!] ShadowPref fix_missing() failed!");
    done();
  
  }
  
  prefs.SPref.setSPValue("test_pref", 1, "test_our_old_value");
  require("sdk/preferences/service").set("extensions.jondofox.test_pref", "");
  prefs.SPref.fix_missing(false);
  
  if(require("sdk/preferences/service").get("extensions.jondofox.test_pref") != "test_our_old_value"){
  
    assert.equal(true, false, "[!] ShadowPref fix_missing() failed!");
    done();
  
  }
  
  prefs.SPref.activate("", true, 0);
  
  for(var i = 0; i < prefs.SPref.important_prefs.length; i++){
  
    if(prefs.SPref.getSPValue(prefs.SPref.important_prefs[i][0], 2) == true && prefs.SPref.getSPValue(prefs.SPref.important_prefs[i][0], 3) == 0){
    
      if(require("sdk/preferences/service").get(prefs.SPref.important_prefs[i][0]) != require("sdk/preferences/service").get("extensions.jondofox." + prefs.SPref.important_prefs[i][0])){
      
        assert.equal(true, false, "[!] ShadowPref activate() failed!");
        done();
      
      }
    
    }
  
  }
  
  assert.equal(true, true, "[i] ShadowPrefs are working!");
  done();
  
}

require("sdk/test").run(exports);