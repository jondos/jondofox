/*
 *  This is still the same code, only migrated to this location
 *  to be better accessable
 */
////////////////////////////////
// Check for D-Mode - PA-Mode
////////////////////////////////

var tabs = require("sdk/tabs");
var tabUtils = require('sdk/tabs/utils');
var data = require("sdk/self").data;
var requests = require("./observer.js");
var proxy = require("./data/bs_proxy.js");
var _ = require("sdk/l10n").get;
var notifications = require("sdk/notifications");
var windows = require("sdk/windows").browserWindows;
var PMS = require("./panelmenu.js");

var PA = {

    // Check once initial tabs
    InitialCheckIfOneTabIsPrivate: function(ShadowPrefs) {
        var closedNormalTabs  = false;
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
        ShadowPrefs.SPref.getCurrUserVal(); // so that we dont miss anything
        ShadowPrefs.SPref.activate("", true, 0);
        // register HTTP observer
        requests.httpRequestObserver.register(ShadowPrefs);
        require("sdk/preferences/service").set("extensions.jondofox.privateMode" , true);
        proxy.proxyService.setProxyIfWasEnabledInDefault();

    },

    setDMode: function(ShadowPrefs) {
        ShadowPrefs.SPref.disable("", true, 0, false);
        // unregister HTTP observer if needed
        if (requests.httpRequestObserver.checkObservingState()) {
            requests.httpRequestObserver.unregister();
        }
        if(require("sdk/preferences/service").get("extensions.jondofox.privateMode")){
          proxy.proxyService.restoreDefaultBackupProxy();
        }
        require("sdk/preferences/service").set("extensions.jondofox.privateMode" , false);
    },
    showNotificationBoxIfTabIsPrivate: function() {

        // Read l19n for the notification-box
        var ntfBoxLabel = _("notification_box_close_non_private_tabs_label");
        var ntfBoxButtonOkLabel = _("notification_box_close_non_private_tabs_button_ok_label");

        // Throw notification-box if tab is private and notification-box is enabled
        tabs.on('ready', function onOpen(tab) {
            if (require("sdk/private-browsing").isPrivate(tab) && require("sdk/preferences/service").get("extensions.jondofox.close.normalTabsInPrivateMode" )) {

                PA.closeNormalTabsInPrivateMode();

                if(closedNormalTabs){
                  var notification = require("./lib/notification-box.js").NotificationBox({
                      'value': 'important-message',
                      'label': ntfBoxLabel,
                      'priority': 'WARNING_HIGH',
                      'image': data.url("icons/ic_info_outline_black_18dp.png"),
                      'buttons': [{
                          'label': ntfBoxButtonOkLabel,
                          'onClick': function() {
                              // Reaction on click Ok
                          }
                      }],
                      'eventCallback': function() {
                          // Reaction on click X
                      }
                  });
                }
                PA.setTabTitle(tab);

                PA.setWindowSize(tab);

                //restore variable

                closedNormalTabs = false;
            }
        });
    },
    closeNormalTabsInPrivateMode: function() {
        for (let tab of tabs) {
            if (!require("sdk/private-browsing").isPrivate(tab)) {
                closedNormalTabs = true;
                tab.close();
            }
        }
    },
    setWindowSize: function(tab) {
        let {
            viewFor
        } = require("sdk/view/core");

        var win = viewFor(tab.window);
        if(win != null ) {
          win.resizeTo(1024, 768);
        }
    },
    setTabTitle: function(window) {
        var private_tab_jondofox_title = _("private_tab_jondofox_title");
        window.title = private_tab_jondofox_title;
    },
    openPrivateWindow: function() {
        windows.open({
            url: "about:privatebrowsing",
            isPinned: false,
            isPrivate: true
        });
        PMS.pannelmenuService.recreatePanelAndListener();
    }
}

function checkPrivateTab(PA, ShadowPrefs) {

    PA.PA.InitialCheckIfOneTabIsPrivate(ShadowPrefs);

    tabs.on('open', function(tab) {
    
        if (require("sdk/private-browsing").isPrivate(tab) && !( require("sdk/preferences/service").get("extensions.jondofox.privateMode" ))) {
            PA.PA.setPAMode(ShadowPrefs);
            windows.on('resize', function(window) {
              console.log("resize");
            });
            console.log("test");
        }else if (!require("sdk/private-browsing").isPrivate(tab) && ( require("sdk/preferences/service").get("extensions.jondofox.privateMode" ))){
          PA.PA.setDMode(ShadowPrefs)
        }

    });

    tabs.on('ready', function(tab) {
    
      if(require("sdk/private-browsing").isPrivate(tab) && (require("sdk/preferences/service").get("extensions.jondofox.privateMode"))){

        if(!ShadowPrefs.localStorage.is_known(tab)){
      
          ShadowPrefs.localStorage.add(tab);
      
        }
        else{
        
          if(ShadowPrefs.localStorage.should_clear(tab)){
          
              console.log("Yey, i know i should clean the storage now, but i dont know how to do so yet.");
            
              worker = tab.attach({
            
                contentScriptFile: require("sdk/self").data.url("js/localStorage.js")
            
              });
            
              worker.port.on("proceed", function(message){
            
                if(message == "YES"){
              
                  console.log("storage is cleared, but to late :(");
                  
                  ShadowPrefs.localStorage.cleared(tab);
                
                }
                else{
                  console.log("no local storage for me :/");
                }
            
              });
          
          }
      
          if(ShadowPrefs.localStorage.is_different_domain(tab)){
          
            //worker = tab.attach({
              // clear window.name here
              //contentScript: 'if(window.name != \'\'){ window.name = \'\'; }'
        
            //});
        
          }
      
        }
      
      }
    
    });

    tabs.on('close', function(tab) {

        var i = 0;

        for (let tab of tabs) {
            if (require("sdk/private-browsing").isPrivate(tab)) {
                i++;
                //tab.title = ""
            }
        }

        if (i == 0 && require("sdk/preferences/service").get("extensions.jondofox.privateMode" )) {
            console.log("set D Mode");
            PA.PA.setDMode(ShadowPrefs);
        }

    });

}

exports.PA = PA;
exports.checkPrivateTab = checkPrivateTab;
