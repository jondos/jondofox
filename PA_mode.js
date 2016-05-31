/*
*  This is still the same code, only migrated to this location
*  to be better accessable
*/
////////////////////////////////
// Check for D-Mode - PA-Mode
////////////////////////////////

var tabs = require("sdk/tabs");
var { setInterval } = require("sdk/timers");
var requests = require("./observer.js");

var PA = {

  isTabPrivate: false,

  // Check once initial tabs
  checkIfOneTabIsPrivate: function(ShadowPrefs){
  
    var i = 0;
    
    for (let tab of tabs) {
    
      if (require("sdk/private-browsing").isPrivate(tab)) {
        
        i++;
        
      }
    
    }
    
    if(i > 0){
    
      this.isTabPrivate = true;
        
      // at least one private Tab is open, apply ShadowPrefs.
      ShadowPrefs.ShadowPrefs.applyShadowPrefs();
      
      // register HTTP observer
      requests.httpRequestObserver.register();
    
    }
    else{
    
      this.isTabPrivate = false;
      
      // Restore Shadow Prefs that are dynamic
      ShadowPrefs.ShadowPrefs.resetShadowPrefs();
      
      // unregister HTTP observer if needed
      if(requests.httpRequestObserver.checkObservingState()){
      
        requests.httpRequestObserver.unregister();
        
      }
    
    }
    
    console.log(this.isTabPrivate);
    require("sdk/simple-prefs").prefs.privateMode = this.isTabPrivate;
  
  },

}

function initTabs(PA, ShadowPrefs){

tabs.on('open', function () {
  PA.PA.checkIfOneTabIsPrivate(ShadowPrefs);
});

tabs.on('close', function () {
  PA.PA.checkIfOneTabIsPrivate(ShadowPrefs);
});

}

exports.PA = PA;
exports.initTabs = initTabs;