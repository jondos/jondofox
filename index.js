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
//var proxy = require("./data/bs_proxy.js");
var PA = require("./PA_mode.js");
var PMS = require("./panelmenu.js");
var _ = require("sdk/l10n").get;

/*
 *  Initialize the ShadowPrefs here if needed
 */
shadow_preferences.SPref.init();
//proxy.proxyService.init();

if (shadow_preferences.SPref.check_installation() == -1) {

    // create ShadowPrefs (extensions.jondofox.xxxx) and activate none dyn prefs, notify about restart
    shadow_preferences.SPref.install();
    //proxy.proxyService.install();

} else if(shadow_preferences.SPref.check_installation() == 0){

    // read ShadowPref values from about:config
    shadow_preferences.SPref.config_readSPValue();
    
    // check if we crashed in pr mode and if so restore user prefs
    if(shadow_preferences.SPref.crashed){
        shadow_preferences.SPref.restore_backup_after_crash();
    }

} else if(shadow_preferences.SPref.check_installation() == -2 || shadow_preferences.SPref.check_if_update()){

    // some 'extensions.jondofox.*' values are missing or differ from our def values.
    if(shadow_preferences.SPref.check_if_update()){
    
        shadow_preferences.SPref.fix_missing(true);
    
    }
    else{
    
        shadow_preferences.SPref.fix_missing(false);
    
    }
    
    // read ShadowPref values from about:config
    shadow_preferences.SPref.config_readSPValue();
    
    // check if we crashed in pr mode and if so restore user prefs
    if(shadow_preferences.SPref.crashed){
        shadow_preferences.SPref.restore_backup_after_crash();
    }

}

/*
 * Initiate Observers here
 */
PA.checkPrivateTab(PA, shadow_preferences);



// CREATE BUTTON
PMS.pannelmenuService.createButton();

// CREATE PANEL MENU
PMS.pannelmenuService.createPanel();







/*
 * Set listener to the button
 */
require("sdk/simple-prefs").on("preferencesButton", PMS.pannelmenuService.getExtPrefClickListener);

PA.PA.showNotificationBoxIfTabIsPrivate();

exports.onUnload = function (reason){

  if(reason == "uninstall" || reason == "disable"){

    var shadow_preferences = require("./preferences.js");
    //var proxy = require("./data/bs_proxy.js");

    shadow_preferences.SPref.uninstall();
    //proxy.proxyService.uninstall();

  }

};
