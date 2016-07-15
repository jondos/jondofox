/*
 * Copyright 2014
 * @author Loic J. Duros lduros@member.fsf.org
 * @author Joshua Cornutt jcornutt@gmail.com
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { Cc, Ci } = require("chrome");
const { getMostRecentBrowserWindow } = require('sdk/window/utils');

/* I haven't found this sort of validation functions in the SDK,
except for the deprecated api-utils module. */
let isString = function (str) {
    if ( !str ) return false;
    return typeof(str) == 'string' || str instanceof String;
};

let isArray = function (obj) {
    if ( !obj || typeof(obj) === 'undefined' ) return false;
    return Object.prototype.toString.call(obj) === '[object Array]';
};

let isObject = function(obj) {
    if ( !obj || typeof(obj) === 'undefined' ) return false;
    return obj instanceof Object;
}

let isInteger = function(val) {
    if ((undefined === val) || (null === val)) return false;
    return !isNaN(val);
}

let isFunction = function(obj) {
    if ( !obj || typeof(obj) === 'undefined' ) return false;
    return {}.toString.call(obj) === '[object Function]';
}

exports.NotificationBox = function (options) {
    options = options || {};
    let mainWindow = getMostRecentBrowserWindow();
    let nbObj = mainWindow.gBrowser.getNotificationBox();
    let priority = nbObj[PRIORITY.INFO_LOW],
        label = '',
        image = 'chrome://browser/skin/Info.png',
        value = '',
        persistence = 0,
        eventCallback = function(){},
        buttons = [];

    if (options.value && isString(options.value))
        value = options.value;

    // Set how many page changes the notification will remain active for.
    if ( options.persistence && isInteger(options.persistence) )
        persistence = options.persistence;

    // Set if the user wants to be notified when the notification closes
    if ( options.eventCallback && isFunction(options.eventCallback) )
        eventCallback = options.eventCallback;

    // Add label or create empty notification.
    if (options.label && isString(options.label))
        label = options.label;

    // Set priority of the notification (from INFO_LOW to CRITICAL_BLOCK)
    if (options.priority && options.priority in PRIORITY)
        priority = nbObj[PRIORITY[options.priority]];

    // Set a custom icon for the notification or use the stock info icon.
    if (options.image && isString(options.image))
        image = options.image;

    // Sanitize and format each notification button
    if ( isArray(options.buttons) )
        for (let i = 0, length = options.buttons.length; i < length; i++)
            buttons.push(NotificationButton(options.buttons[i]));
    else if ( isObject(options.buttons) )
        // If it's not an array of buttons, then it should be a single button.
        buttons.push(NotificationButton(options.buttons));
    else
        buttons = null;

    // Add a new notification to the notificationbox.
    var nObj = nbObj.appendNotification(label, value,
        image, priority, buttons, eventCallback);

    // Set how many page changes the notification will stay active for
    nObj.persistence = persistence;

    // Timeout for closing the notification automatically
    if( options.timeout && isInteger(options.timeout) ) {
        require('sdk/timers').setTimeout( function() {
            if( isFunction(nObj.close) )
                nObj.close();
            }, options.timeout );
    }

    // Expose both the NotificationBox and Notification itself
    return {'notificationbox': nbObj, 'notification': nObj};
};


// Notification button santizing function
var NotificationButton = function (options) {
    options = options || {};
    let accessKey = '',
        onClick = function(){},
        label = "",
        popup = null, // no popup for now... maybe we can use a panel later.
        timeout = 0;

    if ( options.accessKey )
        accessKey = options.accessKey;

    if ( isFunction(options.onClick) )
        onClick = options.onClick;

    if ( options.label )
        label = options.label;

    if ( isInteger(options.timeout) )
        timeout = options.timeout;

    return {label: label,
            accessKey: accessKey,
            callback: onClick,
            popup: popup,
            timeout: timeout};
};

const PRIORITY = {
    'INFO_LOW': 'PRIORITY_INFO_LOW',
    'INFO_MEDIUM': 'PRIORITY_INFO_MEDIUM',
    'INFO_HIGH': 'PRIORITY_INFO_HIGH',
    'WARNING_LOW': 'PRIORITY_WARNING_LOW',
    'WARNING_MEDIUM': 'PRIORITY_WARNING_MEDIUM',
    'WARNING_HIGH': 'PRIORITY_WARNING_HIGH',
    'CRITICAL_LOW': 'PRIORITY_CRITICAL_LOW',
    'CRITICAL_MEDIUM': 'PRIORITY_CRITICAL_MEDIUM',
    'CRITICAL_HIGH': 'PRIORITY_CRITICAL_HIGH',
    'CRITICAL_BLOCK': 'PRIORITY_CRITICAL_BLOCK'
};

exports.PRIORITY = PRIORITY;
