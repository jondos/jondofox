var optionpage = {

    createOptionsArray: function() {
        var options = {
            "preferences": {},
            "proxy": {},
            "email": {}
        };


        // Build preferences json object

        // Build proxy json object
        options.proxy["proxy.choice"] = require("sdk/preferences/service").get("extensions.jondofox.proxy.choice");
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


        // Build email json object

        // return json object
        return options;
    },

    // Save options
    saveOptionsArray: function(pOptions) {
        var proxy = pOptions.proxy;
        console.log(proxy);
        for (var option in proxy) {
            var typeOfPreference = typeof require("sdk/preferences/service").get("extensions.jondofox." + option);
            console.log(typeOfPreference);
            switch (typeOfPreference) {
                case "number":
                      if (proxy[option]) {
                          require("sdk/preferences/service").set("extensions.jondofox." + option, parseInt(proxy[option]));
                      }
                    break;
                case "boolean":
                      if (proxy[option]) {
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
}

// Exsports

exports.optionpage = optionpage;
