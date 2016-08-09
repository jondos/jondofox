var { Cc, Ci } = require("chrome");

var SPref = {

  important_prefs: [],

  initialized: false,

  init: function(){

      this.important_prefs = [];

      this.add("network.http.accept-encoding.secure", "", "gzip, deflate", true, 0);
      this.add("general.useragent.override", "", "Mozilla/5.0 (X11; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0", true, 0);
      this.add("intl.accept_languages", "", "en-US,en", true, 0);
      this.add("browser.sessionhistory.max_entries", "", 2, true, 0);
      this.add("webgl.disabled", "", true, true, 0);
      this.add("browser.display.use_document_fonts", "", 0, true, 0);
      this.add("font.name.sans-serif.x-western", "", "Liberation Sans", true, 0);
      this.add("font.name.serif.x-wester", "", "Liberation Sans", true, 0);
      this.add("privacy.donottrackheader.enabled", "", true, true, 0);
      this.add("datareporting.healthreport.uploadEnabled", "", false, true, 0);
      this.add("datareporting.healthreport.service.enabled", "", false, true, 0);
      this.add("datareporting.policy.dataSubmissionEnabled", "", false, true, 0);
      this.add("toolkit.crashreporter.enabled", "", false, true, 0);

      this.add("font.blacklist.underline_offset", "", "", false, 0);
      this.add("security.ssl.disable_session_identifiers", "", true, false, 0);

      this.initialized = true;

      this.getCurrUserVal();

  },

  add: function(prefName, userDefValue, ourDefValue, isDynamic, importance){

      var tempArray = [];

      tempArray.push(prefName);
      tempArray.push(userDefValue);
      tempArray.push(ourDefValue);
      tempArray.push(isDynamic);
      tempArray.push(importance);

      this.important_prefs.push(tempArray);

      /*
      this.important_prefs[this.important_prefs.length-1] = [];

      this.important_prefs[this.important_prefs.length-1].push(prefName);
      this.important_prefs[this.important_prefs.length-1].push(userDefValue);
      this.important_prefs[this.important_prefs.length-1].push(ourDefValue);
      this.important_prefs[this.important_prefs.length-1].push(isDynamic);
      this.important_prefs[this.important_prefs.length-1].push(importance);
      */
  },

  /*
  * Returns shadowpref value based on valID
  *
  * valID = 0 => userDefValue
  * valID = 1 => ourDefValue
  * valID = 2 => isDynamic
  * valID = 3 => importance
  */
  getSPValue: function(prefName, valID){

      if(!this.initialized){

          console.log("[!] getSPValue: initialize shadowprefs first!");

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.important_prefs[i][0] == prefName){

                  if(valID <= 3 && valID >= 0){

                      return this.important_prefs[i][valID+1];

                  }
                  else{

                      console.log("[!] getSPValue: valID needs to be a value between 0 and 3, you supplied " + valID);

                  }

              }

          }

      }

  },

  /*
  * Modifies shadowpref value based on valID and value
  *
  * valID = 0 => userDefValue
  * valID = 1 => ourDefValue
  * valID = 2 => isDynamic
  * valID = 3 => importance
  */
  setSPValue: function(prefName, valID, value){

      if(!this.initialized){

          console.log("[!] setSPValue: initialize shadowprefs first!");

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.important_prefs[i][0] == prefName){

                  if(valID <= 3 && valID >= 0){

                      this.important_prefs[i][valID+1] = value;

                  }
                  else{

                      console.log("[!] setSPValue: valID needs to be a value between 0 and 3, you supplied " + valID);

                  }

              }

          }

      }

  },

  /*
  * Reads the pref values the user has currently assigned to the prefs we modify, used by this.init()
  */
  getCurrUserVal: function(){

      if(!this.initialized){

          console.log("[!] getCurrUserVal: initialize shadowprefs first!");

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              this.setSPValue(this.important_prefs[i][0], 0, require("sdk/preferences/service").get(this.important_prefs[i][0]));

          }

      }

  },

  /*
  * Checks if shadowprefs (extensions.jondofox.*) are present.
  *
  * returns 0 if TRUE and -1 if FALSE
  */
  check_installation: function(){

      if(!this.initialized){

          console.log("[!] check_installation: initialize shadowprefs first!");

          return -1;

      }
      else{

          var count = 0;

          for(var i = 0; i < this.important_prefs.length; i++){

              if(require("sdk/preferences/service").get("extensions.jondofox." + this.important_prefs[i][0]) != this.getSPValue(this.important_prefs[i][0], 1)){

                  count++;

              }

          }

          if(count > 0){

              return -1;

          }
          else{

              return 0;

          }

      }

  },

  /*
  * writes the value of a extensions.jondofox.* prefs to the original one, thus "activating" the feature.
  *
  * This function takes three args where the first one can be empty (pass "").
  *
  * 'importance' controlls the maximum allowed importance "level" of a sp (shadowpref) to be activated.
  * For example, passing a 1 to 'importance' activates all sp with an importance level of 1 or below.
  * Mind that the other args still have influence!
  *
  * 'isDynamic' can be set to true or false, activating either dynamic or none dynamic sp.
  *
  * 'prefName' can be empty to activate all sp where the other two conditions are true.
  * You can also pass a single pref name to only activate one specific pref, or you can
  * use the '*' character to wildcard like 'browser.*' to activate all sp that start with
  * 'browser.'.
  */
  activate: function(prefName, isDynamic, importance){

      if(!this.initialized){

          console.log("[!] activate: initialize shadowprefs first!");

          return -1;

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.getSPValue(this.important_prefs[i][0], 2) == isDynamic && this.getSPValue(this.important_prefs[i][0], 3) <= importance){

                  if(prefName == ""){

                      require("sdk/preferences/service").set(this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));

                  }
                  else{

                      if(prefName.indexOf("*") == prefName.length){

                          var tempPref = prefName.substr(0, prefName.length-1);

                          if(this.important_prefs[i][0].indexOf(tempPref) != -1){

                              require("sdk/preferences/service").set(this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));

                          }

                      }
                      else{

                          if(this.important_prefs[i][0] == prefName){

                              require("sdk/preferences/service").set(this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));

                          }

                      }

                  }

              }

          }

          return 0;

      }

  },

  /*
  * either writes the saved user value back to the original pref or resets the pref to the system default value
  *
  * This function takes 4 args where the first one can be empty (pass "").
  *
  * 'importance' controlls the maximum allowed importance "level" of a sp (shadowpref) to be disabled.
  * For example, passing a 1 to 'importance' disables all sp with an importance level of 1 or below.
  * Mind that the other args still have influence!
  *
  * 'isDynamic' can be set to true or false, disableing either dynamic or none dynamic sp.
  *
  * 'prefName' can be empty to disable all sp where the other two conditions are true.
  * You can also pass a single pref name to only disable one specific pref, or you can
  * use the '*' character to wildcard like 'browser.*' to disable all sp that start with
  * 'browser.'.
  *
  * 'should_reset' must be set to true or false, either resetting the pref to system default or to the saved user value.
  */
  disable: function(prefName, isDynamic, importance, should_reset){

      if(!this.initialized){

          console.log("[!] disable: initialize shadowprefs first!");

          return -1;

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.getSPValue(this.important_prefs[i][0], 2) == isDynamic && this.getSPValue(this.important_prefs[i][0], 3) <= importance){

                  if(prefName == ""){

                      if(should_reset){

                          require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                      }
                      else{

                          var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                          if(tempVal == undefined){

                            // no user value does exist, thus resetting to system default
                            require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                          }
                          else{

                            require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);

                          }

                      }

                  }
                  else{

                      if(prefName.indexOf("*") == prefName.length){

                          var tempPref = prefName.substr(0, prefName.length-1);

                          if(this.important_prefs[i][0].indexOf(tempPref) != -1){

                              if(should_reset){

                                  require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                              }
                              else{

                                  var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                                  if(tempVal == undefined){

                                    // no user value does exist, thus resetting to system default
                                    require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                                  }
                                  else{

                                    require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);

                                  }

                              }

                          }

                      }
                      else{

                          if(this.important_prefs[i][0] == prefName){

                              if(should_reset){

                                  require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                              }
                              else{

                                  var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                                  if(tempVal == undefined){

                                    // no user value does exist, thus resetting to system default
                                    require("sdk/preferences/service").reset(this.important_prefs[i][0]);

                                  }
                                  else{

                                    require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);

                                  }

                              }

                          }

                      }

                  }

              }

          }

          return 0;

      }

  },

  config_readSPValue: function(){

      if(!this.initialized){

          console.log("[!] config_readSPValue: initialize shadowprefs first!");

          return -1;

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              this.setSPValue(this.important_prefs[i][0], 1, require("sdk/preferences/service").get("extensions.jondofox." + this.important_prefs[i][0]));

          }

      }

  },

  install: function(){

      if(!this.initialized){

          console.log("[!] install: initialize shadowprefs first!");

          return -1;

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              var tempPref = "extensions.jondofox." + this.important_prefs[i][0];

              require("sdk/preferences/service").set(tempPref, this.getSPValue(this.important_prefs[i][0], 1));

          }

          // activate non dyn prefs
          this.activate("", false, 0);

          this.browser_restart();

      }

  },

  uninstall: function(){

      if(!this.initialized){

          console.log("[!] install: initialize shadowprefs first!");

          return -1;

      }
      else{

          for(var i = 0; i < this.important_prefs.length; i++){

              var tempPref = "extensions.jondofox." + this.important_prefs[i][0];

              require("sdk/preferences/service").reset(this.important_prefs[i][0]);
              require("sdk/preferences/service").reset(tempPref);

          }

          this.browser_restart();

      }

  },

  browser_restart: function(){

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
  require("sdk/simple-prefs").prefs.backup_ssl = require("sdk/preferences/service").get("network.proxy.ssl");
  require("sdk/simple-prefs").prefs.backup_ftp = require("sdk/preferences/service").get("network.proxy.ftp");
  require("sdk/simple-prefs").prefs.backup_ftp_port = require("sdk/preferences/service").get("network.proxy.ftp_port");
  //require("sdk/simple-prefs").prefs.backup_gopher_port = require("sdk/preferences/service").get("font.blacklist.underline_offset");
  require("sdk/simple-prefs").prefs.backup_socks = require("sdk/preferences/service").get("network.proxy.socks");
  require("sdk/simple-prefs").prefs.backup_socks_port = require("sdk/preferences/service").get("network.proxy.socks_port");
  require("sdk/simple-prefs").prefs.backup_socks_version = require("sdk/preferences/service").get("network.proxy.socks_version");
}

// Exports

exports.putFontBlacklist = putFontBlacklist;
exports.restoreFontBlacklist = restoreFontBlacklist;
exports.jonDoFoxPreferenceService = jonDoFoxPreferenceService ;
exports.SPref = SPref;
