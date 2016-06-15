/*
 *  This is still the same code, only migrated to this location
 *  to be better accessable
 */
////////////////////////////////
// Check for D-Mode - PA-Mode
////////////////////////////////

var tabs = require("sdk/tabs");
var {
    setInterval
} = require("sdk/timers");
var requests = require("./observer.js");

var PA = {

    // Check once initial tabs
    InitialCheckIfOneTabIsPrivate: function(ShadowPrefs) {

        var i = 0;

        for (let tab of tabs) {
            if (require("sdk/private-browsing").isPrivate(tab)) i++;
        }

        if (i > 0) {
            PA.setPAMode(ShadowPrefs);
        } else {
            PA.setDMode(ShadowPrefs);
        }
    },

    setPAMode: function(ShadowPrefs) {
        ShadowPrefs.ShadowPrefs.applyShadowPrefs();
        // register HTTP observer
        requests.httpRequestObserver.register();
        require("sdk/simple-prefs").prefs.privateMode = true;
        console.log("Firefox is now running in PA-MODE");
    },

    setDMode: function(ShadowPrefs) {
        ShadowPrefs.ShadowPrefs.resetShadowPrefs();
        // unregister HTTP observer if needed
        if (requests.httpRequestObserver.checkObservingState()) {
            requests.httpRequestObserver.unregister();
        }
        require("sdk/simple-prefs").prefs.privateMode = false;
        console.log("Firefox is now running in D-MODE");
    }

}

function checkPrivateTab(PA, ShadowPrefs) {

    PA.PA.InitialCheckIfOneTabIsPrivate(ShadowPrefs);


    tabs.on('open', function(tab) {
        if (require("sdk/private-browsing").isPrivate(tab) && !(require("sdk/simple-prefs").prefs.privateMode)) {
            PA.PA.setPAMode(ShadowPrefs);
        }
    });

    tabs.on('close', function(tab) {

      var i = 0;

      for (let tab of tabs) {
          if (require("sdk/private-browsing").isPrivate(tab)) i++;
      }

      if (i == 0 && require("sdk/simple-prefs").prefs.privateMode) {
          console.log("set D Mode");
          PA.PA.setDMode(ShadowPrefs);
      }

    });

}

exports.PA = PA;
exports.checkPrivateTab = checkPrivateTab;
