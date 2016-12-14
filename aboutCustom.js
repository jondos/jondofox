const { Cc, Ci, Cr, Cu, Cm, components } = require("chrome");

Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
var data = require("sdk/self").data;
var _ = require("sdk/l10n").get;
// globals
var factory;
const aboutPage_description = 'About JonDoFox';
const aboutPage_id = 'a90fbbf0-b313-11e6-9598-0800200c9a66'; // make sure you generate a unique id from https://www.famkruithof.net/uuid/uuidgen
const aboutPage_word = 'jondofox';
const aboutPage_page = data.url("options.html");

var locale = Services.locale;
var prefService = Services.prefs;

function AboutCustom() {};

AboutCustom.prototype = Object.freeze({
    classDescription: aboutPage_description,
    contractID: '@mozilla.org/network/protocol/about;1?what=' + aboutPage_word,
    classID: components.ID('{' + aboutPage_id + '}'),
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

    getURIFlags: function(aURI) {
        return Ci.nsIAboutModule.ALLOW_SCRIPT;
    },

    newChannel: function(aURI, aSecurity_or_aLoadInfo) {
        var channel;
        if (Services.vc.compare(Services.appinfo.version, '47.*') > 0) {
              let uri = Services.io.newURI(aboutPage_page, null, null);
              // greater than or equal to firefox48 so aSecurity_or_aLoadInfo is aLoadInfo
              channel = Services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
        } else {
              // less then firefox48 aSecurity_or_aLoadInfo is aSecurity
              channel = Services.io.newChannel(aboutPage_page, null, null);
        }
        channel.originalURI = aURI;
        return channel;
    }
});

function Factory(component) {
    this.createInstance = function(outer, iid) {
        if (outer) {
            throw Cr.NS_ERROR_NO_AGGREGATION;
        }
        return new component();
    };
    this.register = function() {
        Cm.registerFactory(component.prototype.classID, component.prototype.classDescription, component.prototype.contractID, this);
    };
    this.unregister = function() {
        Cm.unregisterFactory(component.prototype.classID, this);
    }
    Object.freeze(this);
    this.register();
}

exports.main = function() {
  factory = new Factory(AboutCustom);
};

exports.onUnload = function(reason) {
  factory.unregister();
};

function loadi10n(key){
  return _(key);
}

function createOptionsArray() {
    var options = {
        "preferences": {},
        "proxy": {},
        "email": {}
    };


    // Build preferences json object
    var preferences = prefService.getBranch("extensions.jondofox.proxy");
    console.log(preferences);
    // Build proxy json object
    /*options.proxy["proxy.choice"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.choice");
    options.proxy["proxy.custom.ftp"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ftp");
    options.proxy["proxy.custom.ftp_port"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ftp_port");
    options.proxy["proxy.custom.http"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.http");
    options.proxy["proxy.custom.http_port"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.http_port");
    options.proxy["proxy.custom.share_proxy_settings"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.share_proxy_settings");
    options.proxy["proxy.custom.socks"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks");
    options.proxy["proxy.custom.socks_port"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_port");
    options.proxy["proxy.custom.socks_remote_dns"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_remote_dns");
    options.proxy["proxy.custom.socks_version"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_version");
    options.proxy["proxy.custom.ssl"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ssl");
    options.proxy["proxy.custom.ssl_port"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ssl_port");
    */

    // Build email json object

    // return json object
    return options;
}

function saveProperties(pOptions){
  var proxy = pOptions.proxy;
  var isShareProxy = pOptions.proxy["proxy.custom.share_proxy_settings"];
  for (var option in proxy) {
      var typeOfPreference = typeof require("sdk/preferences/service").get("extensions.jondofox." + option);
      console.log(option + " - " + proxy[option] );
      switch (typeOfPreference) {
          case "number":
                if (proxy[option]) {
                    require("sdk/preferences/service").set("extensions.jondofox." + option, parseInt(proxy[option]));
                }
              break;
          case "boolean":
                if (proxy[option] !== "undefined") {
                  require("sdk/preferences/service").set("extensions.jondofox." + option , proxy[option]);
                }
              break;
          case "string":
                if (proxy[option]) {
                  require("sdk/preferences/service").set("extensions.jondofox." + option , proxy[option]);
                }
              break;
          default:
              // do nothing
              break;
      }
  }
}
