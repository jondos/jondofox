var prefs = require("../preferences.js");

exports["testing on_pref_change"] = function(assert, done){

  prefs.ShadowPrefs.initNames();
  prefs.ShadowPrefs.initValues();
  
  if(prefs.ShadowPrefs.ShadowPrefNames[0] == undefined){
  
    assert.equal(true, false, "[!] failed to init ShadowPrefs");
    done();
  
  }
  if(prefs.ShadowPrefs.ShadowPrefValues[0] == undefined){
  
    assert.equal(true, false, "[!] failed to init ShadowPrefs");
    done();
  
  }
  
  prefs.ShadowPrefs.createShadowPrefs();
  prefs.ShadowPrefs.readShadowPrefs();
  
  if(require("sdk/preferences/service").get("extensions.jondofox.font.blacklist.underline_offset") == undefined){
  
    assert.equal(true, false, "[!] failed to write ShadowPrefs");
    done();
  
  }
  if(prefs.ShadowPrefs.ShadowPrefValues[0] == undefined){
  
    assert.equal(true, false, "[!] failed to read ShadowPrefs");
    done();
  
  }
  
  prefs.ShadowPrefs.modShadowPref("font.blacklist.underline_offset", "willsomeonereadthis?");
  
  if(prefs.ShadowPrefs.ShadowPrefValues[0] != "willsomeonereadthis?"){
  
    assert.equal(true, false, "[!] failed to modify ShadowPrefs");
    done();
  
  }
  
  prefs.ShadowPrefs.applyShadowPrefs();
  
  if(require("sdk/preferences/service").get("font.blacklist.underline_offset") != "willsomeonereadthis?"){
  
    assert.equal(true, false, "[!] failed to write modified ShadowPrefs");
    done();
  
  }
  
  assert.equal(true, true, "[i] ShadowPrefs are working!");
  done();
  
}

require("sdk/test").run(exports);