/*
* Includes
*/
var self = require('sdk/self');

var buttons = require('sdk/ui/button/action');
var preferences = require("sdk/simple-prefs").prefs;
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var requests = require("./observer.js");
var style = require('sdk/stylesheet/style');
var data = require("sdk/self").data;

/*
* Initiate Observers here
*/
requests.httpRequestObserver.register();

/*
* Create the Toolbar Button
*/
var button = buttons.ActionButton({
  id: "enable-disable",
  label: "Enable/Disable Addon",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    //"64": "./icon-64.png"
  },
  onClick: handleClick
});

/*
* This function is run when the Toolbar Button is clicked
* it sets the JonDoFoxLite_isEnabled pref
* the return value is used for Unittests
*/
function handleClick(state){
  if(preferences.JonDoFoxLite_isEnabled){
    preferences.JonDoFoxLite_isEnabled = false;
  }
  else if(!preferences.JonDoFoxLite_isEnabled){
    preferences.JonDoFoxLite_isEnabled = true;
  }
}

/*
* Exports needed functions so they are available for others when this file is require()
*/
exports.handleClick = handleClick;


/*
* Set listerner to pref storage
*/
require("sdk/simple-prefs").on("JonDoFoxLite_isEnabled", requests.onPrefChange);


/*
* Listener button and open the tab
*/
function onExtPrefClick(){
  //optionTab.open({url: data.url("options.html")});
  tabs.open({
    url: data.url("options.html"),
    isPinned: true,
    onReady: function(tab) {
      worker = tab.attach({
        contentScriptFile: data.url("options.js"),
        contentScriptOptions: {
            JonDoFoxLite_isEnabled: preferences.JonDoFoxLite_isEnabled
        }
      });

      // Send data to contentScript "options.js"
      worker.port.emit("preferences", preferences.JonDoFoxLite_isEnabled);
      console.log("AddonScript to contentScript :" + preferences.JonDoFoxLite_isEnabled);

      // Receive data from contentScript "options.js"
      worker.port.on("preferences", function(preferences) {
        console.log("AddonScript from contentScript :" + preferences);
        // Set preferences in the storage
        console.log("XXX Preference :" + preferences);
        require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled =  preferences;
      });
    }
  });
}
/*
* Set listener to the button
*/
require("sdk/simple-prefs").on("preferencesButton", onExtPrefClick);
