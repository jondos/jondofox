var ShadowPrefs = {

  ShadowPrefNames: [],
  ShadowPrefValues: [],
  
  /*
  *  init the ShadowPrefNames Array with all config names we want to keep track of
  */
  initNames: function(){
  
    this.ShadowPrefNames = [];
  
    this.ShadowPrefNames.push("font.blacklist.underline_offset");
    this.ShadowPrefNames.push("network.http.accept-encoding.secure");
  
  },
  
  /*
  *  init the ShadowPrefValues Array with default values for ShadowPrefNames. MUST BE IN SAME ORDER!
  */
  initValues: function(){
  
    this.ShadowPrefValues = [];
  
    this.ShadowPrefValues.push("");
    this.ShadowPrefValues.push("gzip, deflate");
  
  },
  
  /*
  *  Apply all prefs saved in 'ShadowPrefNames' and 'ShadoPrefValues' to the original values
  * (meaning the prefs without the 'extensions.jondofox.' prefix)
  */
  applyShadowPrefs: function(){
  
    if(this.ShadowPrefNames.length != this.ShadowPrefValues.length){
    
      console.log("[!] ShadowPrefs do not match!");
    
    }
    else{
    
      for(var i = 0; i < this.ShadowPrefNames.length; i++){
        
        require("sdk/preferences/service").set(this.ShadowPrefNames[i], this.ShadowPrefValues[i]);
    
      }
    
    }
  
  },
  
  /*
  *  Read all ShadowPrefs from about:config into 'ShadowPrefValues'
  */
  readShadowPrefs: function(){
  
    this.ShadowPrefValues = [];
    
    for(var i = 0; i < this.ShadowPrefNames.length; i++){
    
      this.ShadowPrefValues.push(require("sdk/preferences/service").get("extensions.jondofox." + this.ShadowPrefNames[i]));
    
    }
  
  },
  
  /*
  *  If no shadow prefs where ever created, create them with this function
  */
  createShadowPrefs: function(){
  
    if(this.ShadowPrefNames.length != this.ShadowPrefValues.length){
    
      console.log("[!] ShadowPrefs do not match!");
    
    }
    else{
    
      for(var i = 0; i < this.ShadowPrefNames.length; i++){
    
        var tempShadowName = "extensions.jondofox." + this.ShadowPrefNames[i];
      
        require("sdk/preferences/service").set(tempShadowName, this.ShadowPrefValues[i]);
    
      }
    
    }
  
  },
  
  /*
  *  Modify a ShadowPref loaded into 'ShadowPrefValues' 'ShadowPrefNames'
  *  It is needed to write the prefs after modify with 'applyShadowPrefs' or the modified version will be lost
  *  This will however not change the default values of the init() functions
  *
  *  To effectively change values, dont init() at every boot but 'readShadowPrefs' and change the ShadowPref value
  *  in about:config. This cant be done from code right now.
  */
  
  modShadowPref: function(prefName, prefValue){
  
    for(var i = 0; i < this.ShadowPrefNames.length; i++){
    
      if(this.ShadowPrefNames[i] == prefName){
      
        this.ShadowPrefValues[i] = prefValue;
      
      }
    
    }
  
  }

}

var jonDoFoxPreferenceService = {
  initShadowCopy : function initialShadowCopyPreferences(){
    // check if JonDoFoxLite_isEnabled is true (on) and make copy of init prefs / switch to the
    if(require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
      putFontBlacklist();
      createShadowCopyProxyPreferences();
    }
  }

}


/*
* Funktion on JonDoFoxLite_isEnabled ture make set BlackList to system pref and restore them before
*/
function putFontBlacklist(){

      // 1. get backup value of font.blacklist.underline_offset
      var SystemFontBlackListUnderlineOffset = require("sdk/preferences/service").get("font.blacklist.underline_offset");
      // 2. store it in JonDoFox restore.font.blacklist.underline_offset
      require("sdk/simple-prefs").prefs.restoreFontBlacklistUnderline_offset = SystemFontBlackListUnderlineOffset;
      // 3. load JonDoFox font.blacklist.underline_offset
      var JonDoFoxFontBlackListUnderlineOffset = require("sdk/simple-prefs").prefs.fontBlacklistUnderline_offset;
      // 4. set loaded font.blacklist.underline_offset to system font.blacklist.underline_offset
      require("sdk/preferences/service").set("font.blacklist.underline_offset" , JonDoFoxFontBlackListUnderlineOffset);
}
/*
* Funktion on JonDoFoxLite_isEnabled make set BlackList to system pref
*/
function restoreFontBlacklist(){
      // 1. load JonDoFox restore.font.blacklist.underline_offset
      var JonDoFoxRestoreFontBlackListUnderlineOffset = require("sdk/simple-prefs").prefs.restoreFontBlacklistUnderline_offset;
      // 4. set loaded font.blacklist.underline_offset to system font.blacklist.underline_offset
      require("sdk/preferences/service").set("font.blacklist.underline_offset" , JonDoFoxRestoreFontBlackListUnderlineOffset);
}


/*
* Funktion on JonDoFoxLite_isEnabled create shadowcopy of custom and set proxy settings from JonDoFox
*/
function createShadowCopyProxyPreferences(){

  // Create custom backup of proxy preferences
  require("sdk/simple-prefs").prefs.custom_backup_ssl_host = require("sdk/preferences/service").get("network.proxy.ssl");
  require("sdk/simple-prefs").prefs.custom_backup_ftp_host = require("sdk/preferences/service").get("network.proxy.ftp");
  require("sdk/simple-prefs").prefs.custom_backup_ftp_port = require("sdk/preferences/service").get("network.proxy.ftp_port");
  //require("sdk/simple-prefs").prefs.custom_backup_gopher_port = require("sdk/preferences/service").get("font.blacklist.underline_offset");
  require("sdk/simple-prefs").prefs.custom_backup_socks_host = require("sdk/preferences/service").get("network.proxy.socks");
  require("sdk/simple-prefs").prefs.custom_backup_socks_port = require("sdk/preferences/service").get("network.proxy.socks_port");
  require("sdk/simple-prefs").prefs.custom_backup_socks_version = require("sdk/preferences/service").get("network.proxy.socks_version");
}

// Exports

exports.putFontBlacklist = putFontBlacklist;
exports.restoreFontBlacklist = restoreFontBlacklist;
exports.jonDoFoxPreferenceService = jonDoFoxPreferenceService ;
exports.ShadowPrefs = ShadowPrefs;
