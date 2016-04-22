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
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var preferences = require("./preferences.js");
var proxy = require("./data/bs_proxy.js");

/*
* Initiate Observers here
*/
requests.httpRequestObserver.register();

// Initial make a shadowcopy of preferences
preferences.putFontBlacklist;
preferences.jonDoFoxPreferenceService.initShadowCopy();
proxy.proxyService.initShadowProxyCopy();
/*
* Create the Toolbar Button
*/
// Removed by KKP to switch it to an toggleButton
/*var button = buttons.ActionButton({
  id: "enable-disable",
  label: "Enable/Disable Addon",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    //"64": "./icon-64.png"
  },
  onClick: handleClick
});*/

var button = ToggleButton({
  id: "togglePanelMenu",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png"
    //"64": "./icon-64.png"
  },
  onChange: handleChange
});

var panelmenu = panels.Panel({
  width: 200,
  height:265,
  contentURL: self.data.url("panelmenu.html"),
  onHide: handleHide ,
  contentScriptFile :  data.url("cs_panelmenu.js"),
});


// Receive data from contentScript "options.js"
panelmenu.port.on("menuAction", function(jsonParamters) {
  console.log("panelmenu.port.on begin");
  if(jsonParamters.option) {
    console.log(jsonParamters.option)
    onExtPrefClick();
  }

  if(null != jsonParamters.JonDoFoxLite_isEnabled) {
    console.log(jsonParamters.JonDoFoxLite_isEnabled);
    require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled =  jsonParamters.JonDoFoxLite_isEnabled;
  }

  if(null != jsonParamters.proxyChoice) {
    console.log(jsonParamters.proxyChoice);
    proxy.proxyService.setProxy(jsonParamters.proxyChoice);
  }

  console.log(jsonParamters);
  console.log("panelmenu.port.on end");
});

function handleChange(state) {
  if (state.checked) {
    panelmenu.show({
      position: button
    });
    // INIT PARAMETERS
    var panelmenuInitParameter =  "  [" +
                        "  JonDoFoxLite_isEnabled," +
                        preferences.JonDoFoxLite_isEnabled +
                        "  ]";

    panelmenu.port.emit("menuAction", panelmenuInitParameter);

  }
}

function handleHide() {
  button.state('window', {checked: false});
}

/*
* This function is run when the Toolbar Button is clicked
* it sets the JonDoFoxLite_isEnabled pref
* the return value is used for Unittests
*/
function handleClick(state){
  if(preferences.JonDoFoxLite_isEnabled){
    preferences.JonDoFoxLite_isEnabled = false;
    restoreFontBlacklist();
  }
  else if(!preferences.JonDoFoxLite_isEnabled){
    preferences.JonDoFoxLite_isEnabled = true;
    putFontBlacklist()
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
        contentScriptFile: data.url("cs_options.js"),
        contentScriptOptions: {
            JonDoFoxLite_isEnabled: preferences.JonDoFoxLite_isEnabled
        }
      });

      // Send data to contentScript "options.js"
      worker.port.emit("preferences", preferences.JonDoFoxLite_isEnabled);


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

/*
* Funktion on JonDoFoxLite_isEnabled make shadowcopy of preference
*/
function createPreferenceShadowCopy(){


}

////////////////////////////////
// Check for D-Mode - PA-Mode
////////////////////////////////

// Check once initial tabs
function checkIfOneTabIsPrivate(){
  var isTabPrivate = false;

  for (let tab of tabs) {
      if (require("sdk/private-browsing").isPrivate(tab)) {
        isTabPrivate = true;
      }
  }
  console.log(isTabPrivate);
  require("sdk/simple-prefs").prefs.privateMode = isTabPrivate;
}

tabs.on('open', function () {
  checkIfOneTabIsPrivate();
});

tabs.on('close', function () {
  checkIfOneTabIsPrivate();
});
var tabs = require("sdk/tabs");
var { setInterval } = require("sdk/timers");

checkIfOneTabIsPrivate();
