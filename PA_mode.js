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
var _ = require("sdk/l10n").get;
var notifications = require("sdk/notifications");
var windows = require("sdk/windows").browserWindows;

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
        ShadowPrefs.SPref.activate("", true, 0);
        // register HTTP observer
        requests.httpRequestObserver.register();
        require("sdk/simple-prefs").prefs.privateMode = true;
        /*var notification_pamode_label = _("notification_pamode_label");
        var checkIcon = data.url("icons\ic_verified_user_black_18dp.png");
        notifications.notify({
            text: notification_pamode_label,
            iconURL: checkIcon
        });*/
    },

    setDMode: function(ShadowPrefs) {
        ShadowPrefs.SPref.disable("", true, 0, false);
        // unregister HTTP observer if needed
        if (requests.httpRequestObserver.checkObservingState()) {
            requests.httpRequestObserver.unregister();
        }
        /*if (require("sdk/simple-prefs").prefs.privateMode) {
            var notification_dmode_label = _("notification_dmode_label");
            var cancelIcon = data.url("icons\ic_highlight_off_black_18dp");
            notifications.notify({
                text: notification_dmode_label,
                iconURL: cancelIcon
            });
        }*/
        require("sdk/simple-prefs").prefs.privateMode = false;
    },
    showNotificationBoxIfTabIsPrivate: function() {

        // Read l19n for the notification-box
        var ntfBoxLabel = _("notification_box_close_non_private_tabs_label");
        var ntfBoxButtonOkLabel = _("notification_box_close_non_private_tabs_button_ok_label");

        // Throw notification-box if tab is private and notification-box is enabled
        tabs.on('ready', function onOpen(tab) {
            if (require("sdk/private-browsing").isPrivate(tab) && require("sdk/simple-prefs").prefs.JonDoFoxLite_closeNormalTabsInPrivateMode) {
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

                PA.setTabTitle(tab);

                PA.closeNormalTabsInPrivateMode();

                PA.setWindowSize(tab);
            }
        });
    },
    closeNormalTabsInPrivateMode: function() {
        for (let tab of tabs) {
            if (!require("sdk/private-browsing").isPrivate(tab)) {
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
    }
}

function checkPrivateTab(PA, ShadowPrefs) {

    PA.PA.InitialCheckIfOneTabIsPrivate(ShadowPrefs);


    tabs.on('open', function(tab) {
        if (require("sdk/private-browsing").isPrivate(tab) && !(require("sdk/simple-prefs").prefs.privateMode)) {
            PA.PA.setPAMode(ShadowPrefs);

        }
    });



    tabs.on('close', function() {

        var i = 0;

        for (let tab of tabs) {
            if (require("sdk/private-browsing").isPrivate(tab)) {
                i++;
                //tab.title = ""
            }
        }

        if (i == 0 && require("sdk/simple-prefs").prefs.privateMode) {
            console.log("set D Mode");
            PA.PA.setDMode(ShadowPrefs);
        }

    });

}

exports.PA = PA;
exports.checkPrivateTab = checkPrivateTab;
