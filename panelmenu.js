/*
 *
 */
////////////////////////////////
// Create Panel and his listener or remove it
////////////////////////////////

var self = require("sdk/self");
var data = require("sdk/self").data;
var panels = require("sdk/panel");
var PA = require("./PA_mode.js");
var tabs = require("sdk/tabs");
var { ToggleButton } = require('sdk/ui/button/toggle');
var panelmenu ;
var button ;
var proxy = require("./data/bs_proxy.js");
var _ = require("sdk/l10n").get;
var options = require("./optionpage.js");

var pannelmenuService = {

    // Check once initial tabs
    createPanel: function() {
      buildPanel();
      this.createListener();
      return panelmenu;
    },
    createButton : function(){
        button = ToggleButton({
          id: "togglePanelMenu",
          label: "JonDoFox",
          icon: {
              "16": "./icon-16.png",
              "32": "./icon-32.png"
                  //"64": "./icon-64.png"
          },
          onChange: handleChange
      });
    },
    createListener : function(pn){
      panelmenu.port.on("menuAction", getPanelCall);
    },
    removeListener: function (){
      panelmenu.port.removeListener("menuAction", getPanelCall);
    },
    recreatePanelAndListener : function(){
      panelmenu.port.removeListener("menuAction", getPanelCall);
      panelmenu.destroy();
      buildPanel();
      panelmenu.port.on("menuAction", getPanelCall);
    },
    sendMessage : function(message){
      panelmenu.port.emit("menuAction", message);
    },
    getExtPrefClickListener : function(){
      return onExtPrefClick();
    }

}

function getPanelCall(jsonParamters) {
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
}

function buildPanel(){
  panelmenu = panels.Panel({
      width: 200,
      height: 310 ,
      contentURL: self.data.url("panelmenu.html"),
      onHide: handleHide,
      contentScriptFile: data.url("cs_panelmenu.js"),

      dispose: function(){
        // Receive data from contentScript "options.js"
        //panelmenu.port.removeListener("menuAction", getPanelCall);
      },
      onReady : function(){
        // Receive data from contentScript "options.js"
      }
  });
}


/*
 * Listener button and open the tab
 */
function onExtPrefClick() {
    //optionTab.open({url: data.url("options.html")});
    var tab = tabs.open({
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
              options.optionpage.saveOptionsArray(pOptions);
            });
        }
    });

    tab.title = _("option_optionpage_title");
}

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
        //panelmenu.port.emit("menuAction", panelmenuInitParameter);
        pannelmenuService.sendMessage(panelmenuInitParameter);
    }
}

function handleHide() {
    button.state('window', {
        checked: false
    });
}

exports.pannelmenuService = pannelmenuService;
