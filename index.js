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
var options = require("./optionpage.js");
var PA = require("./PA_mode.js");
var _ = require("sdk/l10n").get;

/*
 *  Initialize the ShadowPrefs here if needed
 */
shadow_preferences.SPref.init();
proxy.proxyService.init();

if (shadow_preferences.SPref.check_installation() == -1) {

    // create ShadowPrefs (extensions.jondofox.xxxx) and activate none dyn prefs, notify about restart
    shadow_preferences.SPref.install();
    proxy.proxyService.install();

} else {

    // read ShadowPref values from about:config
    shadow_preferences.SPref.config_readSPValue();

    // check if values read out differ from our default values (but what should i do then?)

}

/*
 * Initiate Observers here
 */
PA.checkPrivateTab(PA, shadow_preferences);



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
 * Listener button and open the tab
 */
function onExtPrefClick() {
    //optionTab.open({url: data.url("options.html")});
    tabs.open({
        url: data.url("options.html"),
        isPinned: true,
        title:  _("option_optionpage_title") ,
        onReady: function(tab) {
            worker = tab.attach({
                contentScriptFile: data.url("cs_options.js"),
                contentScriptOptions: {
                    //JonDoFoxLite_isEnabled: preferences.JonDoFoxLite_isEnabled
                }
            });
            // Send data to contentScript "options.js"
            worker.port.emit("preferences", options.optionpage.createOptionsArray());


            // Receive data from contentScript "options.js"
            worker.port.on("pOptions", function(pOptions) {
              console.log(pOptions);
              options.optionpage.saveOptionsArray(pOptions);
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
    var proxy = require("./data/bs_proxy.js");

    shadow_preferences.SPref.uninstall();
    proxy.proxyService.uninstall();

  }

};
