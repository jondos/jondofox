var { Cc, Ci } = require("chrome");

var ShadowPrefs = {

  ShadowPrefNames: [],
  ShadowPrefValues: [],

  ShadowPrefNames_noneDyn: [],
  ShadowPrefValues_noneDyn: [],

  SP_exist: false,

  /*
  *  init the ShadowPrefNames Array with all config names we want to keep track of
  */
  initNames: function(){

    this.ShadowPrefNames = [];

    this.ShadowPrefNames.push("network.http.accept-encoding.secure");
    this.ShadowPrefNames.push("general.useragent.override");
    this.ShadowPrefNames.push("intl.accept_languages");
    this.ShadowPrefNames.push("browser.sessionhistory.max_entries");
    this.ShadowPrefNames.push("webgl.disabled");
    this.ShadowPrefNames.push("browser.display.use_document_fonts");
    this.ShadowPrefNames.push("font.name.sans-serif.x-western");
    this.ShadowPrefNames.push("font.name.serif.x-western");
    this.ShadowPrefNames.push("privacy.donottrackheader.enabled");
    this.ShadowPrefNames.push("datareporting.healthreport.uploadEnabled");
    this.ShadowPrefNames.push("datareporting.healthreport.service.enabled");
    this.ShadowPrefNames.push("datareporting.policy.dataSubmissionEnabled");
    this.ShadowPrefNames.push("toolkit.crashreporter.enabled");

    // Define none dynamic config settings here, these should be present permanently

    this.ShadowPrefNames_noneDyn = [];

    this.ShadowPrefNames_noneDyn.push("font.blacklist.underline_offset");
    this.ShadowPrefNames_noneDyn.push("security.ssl.disable_session_identifiers"); //statisch, weil laufende ssl verbindungen nicht zurückgesetzt werden

  },

  /*
  *  init the ShadowPrefValues Array with default values for ShadowPrefNames. MUST BE IN SAME ORDER!
  */
  initValues: function(){

    this.ShadowPrefValues = [];

    this.ShadowPrefValues.push("gzip, deflate");
    this.ShadowPrefValues.push("Mozilla/5.0 (X11; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0");
    this.ShadowPrefValues.push("en-US,en");
    this.ShadowPrefValues.push(2);
    this.ShadowPrefValues.push(true);
    this.ShadowPrefValues.push(0);
    this.ShadowPrefValues.push("Liberation Sans");
    this.ShadowPrefValues.push("Liberation Sans");
    this.ShadowPrefValues.push(true);
    this.ShadowPrefValues.push(false);
    this.ShadowPrefValues.push(false);
    this.ShadowPrefValues.push(false)
    this.ShadowPrefValues.push(false);

    // Define none dynamic config settings here, these should be present permanently

    this.ShadowPrefValues_noneDyn = [];

    this.ShadowPrefValues_noneDyn.push("");
    this.ShadowPrefValues_noneDyn.push(true);

  },

  /*
  *  This function checks wether the nonDyn values in about:config match the default ShadowPref ones
  *  return 0 on success and none 0 on mismatch of any kind
  */
  check_noneDynValues: function(){

    if(this.ShadowPrefValues_noneDyn.length == 0){

      console.log("[!] Please init ShadowPref values before running this function!");

      return -1;

    }
    else{

      for(var i = 0; i < this.ShadowPrefValues_noneDyn.length; i++){

        if(require("sdk/preferences/service").get("extensions.jondofox." + this.ShadowPrefValues_noneDyn[i]) != this.ShadowPrefValues_noneDyn[i]){

          return -1;

        }

      }

    }

    return 0;

  },

  /*
  *  Apply only one pref, use this function for dynamic settings
  */
  applyOneShadowPref: function(PrefName){

    if(this.ShadowPrefNames.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames.length; i++){

        if(this.ShadowPrefNames[i] == PrefName){

          require("sdk/preferences/service").set(this.ShadowPrefNames[i], this.ShadowPrefValues[i]);

        }

      }

    }

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
      
      Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = false;

    }

  },

  /*
  *  Apply only one pref, use this function for none dynamic settings
  */
  applyOneShadowPref_noneDyn: function(PrefName){

    if(this.ShadowPrefNames_noneDyn.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

        if(this.ShadowPrefNames_noneDyn[i] == PrefName){

          require("sdk/preferences/service").set(this.ShadowPrefNames_noneDyn[i], this.ShadowPrefValues_noneDyn[i]);

        }

      }

    }

  },

  /*
  *  Apply all prefs saved in 'ShadowPrefNames_noneDyn' and 'ShadoPrefValues_noneDyn' to the original values
  * (meaning the prefs without the 'extensions.jondofox.' prefix)
  */
  applyShadowPrefs_noneDyn: function(){

    if(this.ShadowPrefNames_noneDyn.length != this.ShadowPrefValues_noneDyn.length){

      console.log("[!] ShadowPrefs do not match!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

        require("sdk/preferences/service").set(this.ShadowPrefNames_noneDyn[i], this.ShadowPrefValues_noneDyn[i]);

      }

    }

  },

  /*
  *  Resets all dynamic prefs (meaning those without the ShadowPref prefix)
  */
  resetShadowPrefs: function(){

    if(this.ShadowPrefNames.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames.length; i++){

        require("sdk/preferences/service").reset(this.ShadowPrefNames[i]);

      }
      
      Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;

    }

  },

  /*
  *  Resets all none dynamic prefs (meaning those without the ShadowPref prefix)
  */
  resetShadowPrefs_noneDyn: function(){

    if(this.ShadowPrefNames_noneDyn.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

        require("sdk/preferences/service").reset(this.ShadowPrefNames_noneDyn[i]);

      }

    }

  },

  /*
  *  This function is part of the deinstall function and removes all ShadowPref values.
  *  (meaning those with the ShadowPref prefix, and all dynamic and none dynamic ones)
  */
  delete_allShadowPrefs: function(){

    if(this.ShadowPrefNames_noneDyn.length == 0 || this.ShadowPrefNames.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

        var temp = "extensions.jondofox." + this.ShadowPrefNames_noneDyn[i];

        require("sdk/preferences/service").reset(temp);

      }
      for(var i = 0; i < this.ShadowPrefNames.length; i++){

        var temp = "extensions.jondofox." + this.ShadowPrefNames[i];

        require("sdk/preferences/service").reset(temp);

      }

    }

  },

  // This function does remove all modifications from about:config made by jdf.
  uninstall: function(){

    this.resetShadowPrefs();
    this.resetShadowPrefs_noneDyn();
    this.delete_allShadowPrefs();
    
    // Notify the user that he needs to restart in order to fully reset all prefs
    this.quitBrowser();

  },

  /*
  *  Reset one dynamic preference (meaning those without the ShadowPref prefix)
  */
  resetOneShadowPref: function(PrefName){

    if(this.ShadowPrefNames.length == 0){

      console.log("[!] Please init the ShadowPref names before running this function!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames.length; i++){

        if(this.ShadowPrefNames[i] == PrefName){

          require("sdk/preferences/service").reset(this.ShadowPrefNames[i]);

        }

      }

    }

  },

  /*
  *  Read all ShadowPrefs from about:config into 'ShadowPrefValues' and 'ShadowPrefValues_noneDyn'
  */
  readShadowPrefs: function(){

    this.ShadowPrefValues = [];

    for(var i = 0; i < this.ShadowPrefNames.length; i++){

      this.ShadowPrefValues.push(require("sdk/preferences/service").get("extensions.jondofox." + this.ShadowPrefNames[i]));

    }

    for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

      this.ShadowPrefValues_noneDyn.push(require("sdk/preferences/service").get("extensions.jondofox." + this.ShadowPrefNames_noneDyn[i]));

    }

  },

  /*
  *  Sets the 'SP_exist' value to true if ShadowPrefs exist in about:config
  */
  ShadowPref_check_exist: function(){

    this.readShadowPrefs();

    if(this.ShadowPrefValues.length != 0){
      // check also for none dynamic prefs!!
      this.SP_exist = true;

    }
    else{

      this.SP_exist = false;

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
  *  Same as 'createShadowPrefs()' but for none dynamic prefs
  */
  createShadowPrefs_noneDyn: function(){

    if(this.ShadowPrefNames_noneDyn.length != this.ShadowPrefValues_noneDyn.length){

      console.log("[!] ShadowPrefs do not match!");

    }
    else{

      for(var i = 0; i < this.ShadowPrefNames_noneDyn.length; i++){

        var tempShadowName = "extensions.jondofox." + this.ShadowPrefNames_noneDyn[i];

        require("sdk/preferences/service").set(tempShadowName, this.ShadowPrefValues_noneDyn[i]);

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

  },

  // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIAppStartup#Constants
  quitBrowser: function(){
  
    var startup = Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup);
    
    var _ = require("sdk/l10n").get;
    var notifications = require("sdk/notifications");
    var ntfBoxLabel = _("notification_box_restart_nondynPrefs");
    var ntfBoxButtonOkLabel = _("notification_box_restart_nondynPrefs_button_ok");
    var data = require("sdk/self").data;

    var notification = require("./lib/notification-box.js").NotificationBox({
                        'value': 'important-message',
                        'label': ntfBoxLabel,
                        'priority': 'WARNING_HIGH',
                        'image': data.url("icons/ic_info_outline_black_18dp.png"),
                        'buttons': [{
                            'label': ntfBoxButtonOkLabel,
                            'onClick': function() {
                                // Restart Browser
                                startup.quit(0x12);
                            }
                       }],
                       'eventCallback': function() {
                           // Reaction on click X
                        }
                    });

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
*  the following three functions should be reviewed and maybe deleted (replaced by ShadowPrefs)
*/

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
