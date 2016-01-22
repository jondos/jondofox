var self = require('sdk/self');

var buttons = require('sdk/ui/button/action');
var preferences = require("sdk/simple-prefs").prefs;

var requests = require("./observer.js");

/*
* Initiate Observers here
*/
requests.httpRequestObserver.register();

require("sdk/simple-prefs").on("JonDoFoxLite_isEnabled", requests.onPrefChange);

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
// test github
