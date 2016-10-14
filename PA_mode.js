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
        requests.httpRequestObserver.register();
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

var localStorage = {

  tab_data: [],
  
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
  
    if(url.search("http://") == 0){
      url = url.substr(7, url.length);
    }
    else if(url.search("https://") == 0){
      url = url.substr(8, url.length);
    }
    
    if(url.search("/") != -1){
      url = url.substr(0, url.search("/"));
    }
    
    return url;
  
  },
  
  // The following function checks wether we are facing a new domain and updates the internal memory accordingly
  is_different_domain: function(tab){
  
    for(var i = 0; i < this.tab_data.length; i++){
    
      if(tab.id == this.tab_data[i][1]){
      
        if(this.get_host_from_url(tab.url) != this.tab_data[i][0]){
        
          this.tab_data[i][0] = this.get_host_from_url(tab.url);
        
          return true;
        
        }
      
      }
    
    }
    
    return false;
  
  }

}

var storage = localStorage;

function checkPrivateTab(PA, ShadowPrefs) {

    PA.PA.InitialCheckIfOneTabIsPrivate(ShadowPrefs);


    tabs.on('open', function(tab) {
        // Is the secons condition correct?? (take a look at line 239)
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
      
        if(!storage.is_known(tab)){
      
          storage.add(tab);
      
        }
        else{
      
          if(storage.is_different_domain(tab)){
        
            console.log("Yey, i know i should clean the storage now, but i dont know how to do so yet.");
          
            worker = tab.attach({
              // clear window.name here
              contentScript: 'if(window.name != \'\'){ window.name = \'\'; }'
        
            });
        
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
