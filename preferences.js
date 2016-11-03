var { Cc, Ci } = require("chrome");

var SPref = {

  important_prefs: [],

  initialized: false,
  
  crashed: false, // set this to true when entering pr mode, and to false when leaving (thus this is set to true when we dont exit pr mode cleanly)
  
  xpi_version: 1,

  init: function(){

      this.important_prefs = [];
      
      this.add("xpi_version", "", this.xpi_version, true, 999); // <-- this is a special setting, only for internal purposes. never activate this.
      this.add("crashed", "", this.crashed, true, 999); // <-- this is a special setting, only for internal purposes. never activate this.

      this.add("network.http.accept-encoding.secure", "", "gzip, deflate", true, 0);
      
      this.add("general.useragent.override", "", "Mozilla/5.0 (X11; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0", true, 0);
      
      this.add("intl.accept_languages", "", "en-US,en", true, 0);
      
      this.add("webgl.disabled", "", true, true, 0);
      
      this.add("browser.sessionhistory.max_entries", "", 2, true, 0);
      this.add("browser.display.use_document_fonts", "", 0, true, 0);
      
      this.add("font.name.sans-serif.x-western", "", "Liberation Sans", true, 0);
      this.add("font.name.serif.x-wester", "", "Liberation Sans", true, 0);
      this.add("font.blacklist.underline_offset", "", "", false, 0);
      
      this.add("privacy.donottrackheader.enabled", "", true, true, 0);
      
      this.add("datareporting.healthreport.uploadEnabled", "", false, true, 0);
      this.add("datareporting.healthreport.service.enabled", "", false, true, 0);
      this.add("datareporting.policy.dataSubmissionEnabled", "", false, true, 0);
      
      this.add("toolkit.crashreporter.enabled", "", false, true, 0);
      this.add("toolkit.telemetry.enabled", "", false, true, 0);
      
      this.add("security.ssl.disable_session_identifiers", "", true, false, 0);
      
      this.add("media.peerconnection.enabled", "", false, true, 0);

      this.initialized = true;

      this.getCurrUserVal();
      
      if(require("sdk/preferences/service").get("extensions.jondofox.crashed") != undefined){
      
          this.setSPValue("crashed", 1, require("sdk/preferences/service").get("extensions.jondofox.crashed"));
      
      }

  },

  add: function(prefName, userDefValue, ourDefValue, isDynamic, pref_class){

      var tempArray = [];

      tempArray.push(prefName);
      tempArray.push(userDefValue);
      tempArray.push(ourDefValue);
      tempArray.push(isDynamic);
      tempArray.push(pref_class);

      this.important_prefs.push(tempArray);
  },
  
  check_if_update: function(){
  
      if(!this.initialized){

          console.log("[!] getSPValue: initialize shadowprefs first!");

      }
      else{
      
          if(require("sdk/preferences/service").get("extensions.jondofox.xpi_version") < this.xpi_version){
          
              return true;
          
          }
          else{
          
              return false;
          
          }
      
      }
  
  },

  /*
  * Returns shadowpref value based on valID
  *
  * valID = 0 => userDefValue
  * valID = 1 => ourDefValue
  * valID = 2 => isDynamic
  * valID = 3 => pref_class
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
  * valID = 3 => pref_class
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

          // index 1 cause of xpi version number at 0
          for(var i = 1; i < this.important_prefs.length; i++){

              this.setSPValue(this.important_prefs[i][0], 0, require("sdk/preferences/service").get(this.important_prefs[i][0]));

          }

      }

  },

  /*
  * Checks if shadowprefs (extensions.jondofox.*) are present.
  *
  * returns 0 if TRUE, -1 if FALSE and -2 if some prefs are missing (eg we are updating or someone destroyed parts of our prefs)
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

          if(count > 0 && count < this.important_prefs.length){

              return -2;

          }
          else if(count == this.important_prefs.length){

              return -1;

          }
          else{
          
              return 0;
          
          }

      }

  },
  
  /*
  * goes through all saved prefs in 'important_prefs' and matches them with the 'extensions.jondofox.*' values from about:config.
  * 
  * If 'is_update' is TRUE, the value in 'extensions.jondofox.*' will be overwritten with our def value
  * If 'is_update' is FALSE, the value in 'extensions.jondofox.*' will only be overwritten if it is empty
  */
  fix_missing: function(is_update){
  
      if(!this.initialized){
      
          console.log("[!] check_installation: initialize shadowprefs first!");

          return -1;
      
      }
      else{
      
          for(var i = 0; i < this.important_prefs.length; i++){
          
              if(is_update){
              
                  if(require("sdk/preferences/service").get("extensions.jondofox." + this.important_prefs[i][0]) != this.getSPValue(this.important_prefs[i][0], 1)){
                  
                      require("sdk/preferences/service").set("extensions.jondofox." + this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));
                  
                  }
              
              }
              else{
              
                  if(require("sdk/preferences/service").get("extensions.jondofox." + this.important_prefs[i][0]) == ""){
                  
                      require("sdk/preferences/service").set("extensions.jondofox." + this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));
                  
                  }
              
              }
          
          }
      
      }
  
  },

  /*
  * writes the value of a extensions.jondofox.* prefs to the original one, thus "activating" the feature.
  *
  * This function takes three args where the first one can be empty (pass "").
  *
  * 'pref_class' defines the preference class which should be activated.
  * Mind that the other args still have influence!
  *
  * 'isDynamic' can be set to true or false, activating either dynamic or none dynamic sp.
  *
  * 'prefName' can be empty to activate all sp where the other two conditions are true.
  * You can also pass a single pref name to only activate one specific pref, or you can
  * use the '*' character to wildcard like 'browser.*' to activate all sp that start with
  * 'browser.'.
  */
  activate: function(prefName, isDynamic, pref_class){

      if(!this.initialized){

          console.log("[!] activate: initialize shadowprefs first!");

          return -1;

      }
      else{
      
          this.crashed = true;
          this.backup_for_crash();

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.getSPValue(this.important_prefs[i][0], 2) == isDynamic && this.getSPValue(this.important_prefs[i][0], 3) == pref_class){

                  if(prefName == ""){

                      require("sdk/preferences/service").set(this.important_prefs[i][0], this.getSPValue(this.important_prefs[i][0], 1));
                      
                      if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                          Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = false;
                      
                      }

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
                              
                              if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                  Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = false;
                      
                              }

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
  * 'pref_class' defines the preference class which should be disabled.
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
  disable: function(prefName, isDynamic, pref_class, should_reset){

      if(!this.initialized){

          console.log("[!] disable: initialize shadowprefs first!");

          return -1;

      }
      else{
      
          this.crashed = false;

          for(var i = 0; i < this.important_prefs.length; i++){

              if(this.getSPValue(this.important_prefs[i][0], 2) == isDynamic && this.getSPValue(this.important_prefs[i][0], 3) == pref_class){

                  if(prefName == ""){

                      if(should_reset){

                          require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                          
                          if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                              Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                          }

                      }
                      else{

                          var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                          if(tempVal == undefined){

                            // no user value does exist, thus resetting to system default
                            require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                            
                            if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                            }

                          }
                          else{

                            require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);
                            
                            if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                            }

                          }

                      }

                  }
                  else{

                      if(prefName.indexOf("*") == prefName.length){

                          var tempPref = prefName.substr(0, prefName.length-1);

                          if(this.important_prefs[i][0].indexOf(tempPref) != -1){

                              if(should_reset){

                                  require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                                  
                                  if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                      Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                  }

                              }
                              else{

                                  var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                                  if(tempVal == undefined){

                                    // no user value does exist, thus resetting to system default
                                    require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                                    
                                    if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                        Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                    }

                                  }
                                  else{

                                    require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);
                                    
                                    if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                         Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                     }

                                  }

                              }

                          }

                      }
                      else{

                          if(this.important_prefs[i][0] == prefName){

                              if(should_reset){

                                  require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                                  
                                  if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                      Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                  }

                              }
                              else{

                                  var tempVal = this.getSPValue(this.important_prefs[i][0], 0);

                                  if(tempVal == undefined){

                                    // no user value does exist, thus resetting to system default
                                    require("sdk/preferences/service").reset(this.important_prefs[i][0]);
                                    
                                    if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                        Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                    }

                                  }
                                  else{

                                    require("sdk/preferences/service").set(this.important_prefs[i][0], tempVal);
                                    
                                    if(this.important_prefs[i][0] == "toolkit.crashreporter.enabled"){
                      
                                        Cc["@mozilla.org/toolkit/crash-reporter;1"].getService(Ci.nsICrashReporter).submitReports = true;
                      
                                    }

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
  
  /*
  * creates for every modified user pref a 'extensions.jondofox.crashbackup.*' pref to restore from in case of a crash while in pr mode
  */
  backup_for_crash: function(){
  
      if(!this.initialized){

          console.log("[!] install: initialize shadowprefs first!");

          return -1;

      }
      else{
      
          for(var i = 0; i < this.important_prefs.length; i++){
          
              var tempPref = "extensions.jondofox.crashbackup." + this.important_prefs[i][0];
              
              if(this.getSPValue(this.important_prefs[i][0], 0) != undefined && this.getSPValue(this.important_prefs[i][0], 0) != ""){
              
                  require("sdk/preferences/service").set(tempPref, this.getSPValue(this.important_prefs[i][0], 0));
              
              }
          
          }
      
      }
  
  },
  
  restore_backup_after_crash: function(){
  
      if(!this.initialized){

          console.log("[!] install: initialize shadowprefs first!");

          return -1;

      }
      else{
      
          for(var i = 0; i < this.important_prefs.length; i++){
          
              var tempPref = "extensions.jondofox.crashbackup." + this.important_prefs[i][0];
              
              require("sdk/preferences/service").set(this.important_prefs[i][0], require("sdk/preferences/service").get(tempPref));
          
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

          this.browser_restart(true);

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
              var tempPrefBackup = "extensions.jondofox.crashbackup." + this.important_prefs[i][0];

              require("sdk/preferences/service").reset(this.important_prefs[i][0]);
              require("sdk/preferences/service").reset(tempPref);
              require("sdk/preferences/service").reset(tempPrefBackup);

          }

          this.browser_restart(false);

      }

  },

  browser_restart: function(should_popup){

      var startup = Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup);

      var _ = require("sdk/l10n").get;
      var notifications = require("sdk/notifications");
      var ntfBoxLabel = _("notification_box_restart_nondynPrefs");
      var ntfBoxButtonOkLabel = _("notification_box_restart_nondynPrefs_button_ok");
      var data = require("sdk/self").data;

      if(should_popup){
      
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
      else{
        
        var notification = require("./lib/notification-box.js").NotificationBox({
                                                                              'value': 'important-message',
                                                                              'label': ntfBoxLabel,
                                                                              'priority': 'WARNING_HIGH',
                                                                              'image': data.url("icons/ic_info_outline_black_18dp.png"),
                                                                              'eventCallback': function() {
                                                                              // Reaction on click X
                                                                              }
                                                                              });
      
      }

  }

}

var localStorage = {

  tab_data: [],
  need_to_clear: [],
  
  get_tab_count: function(tab, tabs){
  
    var count = 0;
  
    for(let tab of tabs){
    
      count = count + 1;
    
    }
    
    return count;
  
  },
  
  add: function(tab){
  
    var tempArray = [];
    
    tempArray.push(this.get_host_from_url(tab.url));
    tempArray.push(tab.id);
    
    this.tab_data.push(tempArray);
  
  },
  
  is_known: function(tab){
  
    for(var i = 0; i < this.tab_data.length; i++){
    
      if(this.tab_data[i][1] == tab.id){
      
        return true;
      
      }
    
    }
    
    return false;
  
  },
  
  get_host_from_url: function(url){
  
    if(url.indexOf("http://") == 0){
      url = url.substr(7, url.length);
    }
    else if(url.indexOf("https://") == 0){
      url = url.substr(8, url.length);
    }
    
    if(url.indexOf("/") != -1){
      url = url.substr(0, url.indexOf("/"));
    }
    
    if(url.indexOf("www.") == 0){
      url = url.substr(4, url.length);
    }
    
    // for subdomains
    if(url.indexOf(".") != -1 && url.indexOf(".") != url.length){
    
      var temp = url.substr(url.indexOf(".")+1, url.length);

      if(temp.indexOf(".") != -1){
        url = url.substr(url.indexOf(".")+1, url.length);
      }
    
    }
    
    return url;
  
  },
  
  // The following function checks wether we are facing a new domain and updates the internal memory accordingly
  is_different_domain: function(tab){
  
    for(var i = 0; i < this.tab_data.length; i++){
    
      if(tab.id == this.tab_data[i][1]){
      
        if(this.get_host_from_url(tab.url) != this.tab_data[i][0]){
          
          if(!this.host_known(this.tab_data[i][0])){
            this.need_to_clear.push(this.tab_data[i][0]);
          }
          
          this.tab_data[i][0] = this.get_host_from_url(tab.url);
        
          return true;
        
        }
      
      }
    
    }
    
    return false;
  
  },
  
  is_different_domain_httpChannel: function(url, tabID){
  
    var host = this.get_host_from_url(url);
  
    for(var i = 0; i < this.tab_data.length; i++){
    
      if(tabID == this.tab_data[i][1]){
      
        if(this.get_host_from_url(url) != this.tab_data[i][0]){
        
          if(!this.host_known(host)){
            this.need_to_clear.push(host);
          }
        
          return true;
        
        }
      
      }
    
    }
    
    return false;
  
  },
  
  should_clear: function(tab){
  
    for(var i = 0; i < this.need_to_clear.length; i++){
    
      if(this.get_host_from_url(tab.url) == this.need_to_clear[i]){
      
        return true;
      
      }
    
    }
    
    return false;
  
  },
  
  httpChannel_should_clear: function(url){
  
    url = this.get_host_from_url(url);
  
    for(var i = 0; i < this.need_to_clear.length; i++){
    
      if(this.need_to_clear[i] == url){
      
        return true;
      
      }
    
    }
    
    return false;
  
  },
  
  host_known: function(host){
  
    for(var i = 0; i < this.need_to_clear.length; i++){
    
      if(this.need_to_clear[i] == host){
      
        return true;
      
      }
    
    }
    
    return false;
  
  },
  
  cleared: function(tab){
  
    var temp_array = [];
    var host = this.get_host_from_url(tab.url);
  
    for(var i = 0; i < this.need_to_clear.length; i++){
    
      if(this.need_to_clear[i] != host){
      
        temp_array.push(host);
      
      }
    
    }
    
    need_to_clear = temp_array;
  
  },
  
  httpChannel_cleared: function(url){
  
    var temp_array = [];
    var host = this.get_host_from_url(url);
    
    for(var i = 0; i < this.need_to_clear.length; i++){
    
      if(this.need_to_clear[i] != host){
      
        temp_array.push(host);
      
      }
    
    }
    
    need_to_clear = temp_array;
  
  },
  
  httpChannel_get_host: function(id){
  
    for(var i = 0; i < this.tab_data.length; i++){
    
      if(this.tab_data[i][1] == id){
      
        return this.tab_data[i][0];
      
      }
      
    }
    
    return null;
  
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
exports.jonDoFoxPreferenceService = jonDoFoxPreferenceService;
exports.SPref = SPref;
exports.localStorage = localStorage;
