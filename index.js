/*
 * Includes
 */
var self = require('sdk/self');

var buttons = require('sdk/ui/button/action');
var preferences = require("sdk/simple-prefs").prefs;
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var requests = require("./observer.js");
var Style = require("sdk/stylesheet/style").Style;
var data = require("sdk/self").data;
var {
    ToggleButton
} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var shadow_preferences = require("./preferences.js"); //renamed cause of dublicated variable declaration, CHECK THIS!
var proxy = require("./data/bs_proxy.js");
var PA = require("./PA_mode.js");

/*
 *  Initialize the ShadowPrefs here if needed
 */
shadow_preferences.SPref.init();

if (shadow_preferences.SPref.check_installation() == -1) {

    // create ShadowPrefs (extensions.jondofox.xxxx) and activate none dyn prefs, notify about restart
    shadow_preferences.SPref.install();

} else {

    // read ShadowPref values from about:config
    shadow_preferences.SPref.config_readSPValue();

    // check if values read out differ from our default values (but what should i do then?)

}

/*
 * Initiate Observers here
 */
PA.checkPrivateTab(PA, shadow_preferences);

var { PrefsTarget } = require("sdk/preferences/event-target");

// listen to the same branch which reqire("sdk/simple-prefs") does
var target = PrefsTarget({ branchName: "extensions.jondofox.privateMode" });
target.on("test", function(prefName) {
  console.log(prefName) // logs "test"
  console.log(target.prefs[name]) // logs true
});

var button = ToggleButton({
    id: "togglePanelMenu",
    label: "JonDoFox",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png"
            //"64": "./icon-64.png"
    },
    onChange: handleChange
});

var panelmenu = panels.Panel({
    width: 200,
    height: 310 ,
    contentURL: self.data.url("panelmenu.html"),
    onHide: handleHide,
    contentScriptFile: data.url("cs_panelmenu.js")
});


// Receive data from contentScript "options.js"
panelmenu.port.on("menuAction", function(jsonParamters) {
    // if key is option
    if (jsonParamters.option) {
        console.log(jsonParamters.option)
        onExtPrefClick();
    }
    // if key is privateBrowsing
    if (null != jsonParamters.privateBrowsing) {
      PA.PA.openPrivateWindow();
    }
    // if key is proxyChoice
    if (null != jsonParamters.proxyChoice) {
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , jsonParamters.proxyChoice);
        if(require("sdk/preferences/service").get("extensions.jondofox.privateMode")){
          proxy.proxyService.setProxy(jsonParamters.proxyChoice);
        }
    }
});

function handleChange(state) {
    if (state.checked) {
        panelmenu.show({
            position: button
        });
        // INIT PARAMETERS
        var panelmenuInitParameter = [];
        var obj = {};
        obj["proxy.choice"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.choice");
        panelmenuInitParameter.push(obj);
        panelmenu.port.emit("menuAction", panelmenuInitParameter);

    }
}

function handleHide() {
    button.state('window', {
        checked: false
    });
}

/*
 * This function is run when the Toolbar Button is clicked
 * it sets the JonDoFoxLite_isEnabled pref
 * the return value is used for Unittests
 */
function handleClick(state) {
    if (preferences.JonDoFoxLite_isEnabled) {
        preferences.JonDoFoxLite_isEnabled = false;
        /*
         *  removed 'restoreFontBlacklist()', needs to be done over ShadowPrefs
         */
    } else if (!preferences.JonDoFoxLite_isEnabled) {
        preferences.JonDoFoxLite_isEnabled = true;
        /*
         *  removed 'putFontBlacklist()', needs to be done over Shadow Prefs
         */
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
function onExtPrefClick() {
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
                require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled = preferences;
            });
        }
    });
}
/*
 * Set listener to the button
 */
require("sdk/simple-prefs").on("preferencesButton", onExtPrefClick);

PA.PA.showNotificationBoxIfTabIsPrivate();

exports.onUnload = function (reason){

  if(reason == "uninstall" || reason == "disable"){

    var shadow_preferences = require("./preferences.js");

    shadow_preferences.SPref.uninstall();

  }

};
