var {Cc, Ci, Cr} = require("chrome");
var preferences = require("./preferences.js");

var ShadowPrefs = null;

// dont tell me, i know it..
function saveShadowPrefs(prefs){

  ShadowPrefs = prefs;

}

function getShadowPref(){

  return ShadowPrefs;

}


// KKP removed cause no functionality - only logging  - 04.08.2016
/*require("sdk/tabs").on("ready", function(tab) {
  // Private mode
  if (!require("sdk/private-browsing").isPrivate(tab)) {
    console.log("JONDOFOX : NON PRIVATE Tab");
  }
  else {
    console.log("JONDOFOX : IS PRIVATE Tab");
  }
  // doNotTrack
  if (require("sdk/preferences/service").isSet("privacy.donottrackheader.enabled")) {
    console.log("JONDOFOX : DO NOT TRACK IS ENABLED");
  } else if(!require("sdk/preferences/service").isSet("privacy.donottrackheader.enabled")){
    console.log("JONDOFOX : DO NOT TRACK IS DISABLED");
  }
});*/


/*
* This is code from the 'old' XPI and should always work if NOT in Uittest Mode
*/
function getDOMWindow(channel){

  var notificationCallbacks;
  var wind = null;
  var loadGroupNot = false;

  if (channel.notificationCallbacks) {

    notificationCallbacks = channel.notificationCallbacks;

  } else {

    if (channel.loadGroup) {

      notificationCallbacks = channel.loadGroup.notificationCallbacks;
      loadGroupNot = true;

    } else {

      notificationCallbacks = null;

    }
  }

  if (!notificationCallbacks) {

    //console.log("We found no Notificationcallbacks! Returning null...");

  } else {

    try {

      wind = notificationCallbacks.getInterface(Ci.nsILoadContext).associatedWindow;

    } catch (e) {

      // If we aren't here because the loadGroup notificationCallbacks got
      // used and we get the loadGroup check them. That is e.g. needed for
      // CORS requests. See:
      // https://trac.torproject.org/projects/tor/ticket/3739

      if (!loadGroupNot && channel.loadGroup) {

        notificationCallbacks = channel.loadGroup.notificationCallbacks;

        try {

          wind = notificationCallbacks.getInterface(Ci.nsILoadContext).associatedWindow;

        } catch (e) {

          //console.log("Error while trying to get the Window for the second time: " + e);

        }
      }
    }
  }
  
  if(!wind){
  
    try{
          
      wind = require("sdk/window/utils").getMostRecentBrowserWindow()
          
    }
    catch(e){
          
      console.log("failed: " + e);
          
    }
  
  }

  return wind;

}

function getCurrentTab(channel){

  var wind = this.getDOMWindow(channel);
  
  if(wind){
  
    try{
      //thanks to #extdev @mozilla irc, altho this is not the "right" way to go...
      var { modelFor } = require("sdk/model/core");
      
      return modelFor(wind.getBrowser().getTabForBrowser(wind.getBrowser().selectedBrowser));
    
    }
    catch(e){
    
      return null;
    
    }
  
  }
  
  return null;

}

/*
* this function replaces 'getTabContentWindow(tab)' => 'getBrowserForTab(tab).contentWindow'
* from sdk/tabs/utils.js
*/
function getTabBrowser(channel){

  var wind = this.getDOMWindow(channel);
  
  if(wind){
  
    try{
    
      return wind.getBrowser().selectedBrowser;
    
    }
    catch(e){
    
      console.log("ERROR running getTabBrowser: " + e);
    
      return null;
    
    }
  
  }
  
  return null;

}

/*
* This function tries to get the parent Host, meaning the Website the Browser has opened
* in the current Window/Tab (so that scripts loaded from the Website hosted on a different
* host are third party Hosts)
*
* Tries to identify the parent Host via:
*  - DOMWindow
*  - Cookie?
*  - Referrer
*
* This code is from the 'old' XPI
*/
function getParentHost(channel) {

  var wind;
  var parentHost = null;
  wind = this.getDOMWindow(channel);

  if (wind) {

    try {

      //parentHost = wind.top.location.hostname;
      parentHost = wind.getBrowser().selectedBrowser.contentWindow.location.host;
      
      return parentHost;

    } catch (ex) {

      //console.log("nsIDOMWindow seems not to be available here!");

    }

  }

  // We are still here, thus something went wrong. Trying further things.
  // We can't rely on the Referer here as this can legitimately be
  // 1st party while the content is still 3rd party (from a bird's eye
  // view). Therefore...

  try {

    //I still dont know how to get this to work...

    parentHost = cookiePerm.getOriginatingURI(channel).host;
    //console.log("Used getOrigingURI! And parentHost is: " + parentHost + "\n");

    return parentHost;

  } catch (e) {

    //console.log("getOriginatingURI failed as well: " + e + "\nWe try our last resort the Referer...");

  } finally {

    // Getting the host via getOriginatingURI failed as well (e.g. due to
    // browser-sourced favicon or safebrowsing requests or the method not
    // being available in Gecko > 17). Resorting to the Referer.

    if (channel.referrer) {

      parentHost = channel.referrer.host;

    } else {

      //console.log("No Referer either. Could be 3rd party interaction though.");

    }

  }
  
  return parentHost;

}

/*
* This function checks wether the Referer header needs to be cleared, and does it if needed.
* It does this the following way:
*
* If wen can match the current httpChannel to the correct tab{
*       If the domain of the current httpChannel differs from the saved domain of the corresponding tab{
*              clear the referer
*       }
* }
*
* see preferences.js into localStorage for the list.
*/
function clearReferer(httpChannel){

  try{
            
    var ShadowPrefs = getShadowPref();
            
    if(getCurrentTab(httpChannel) && ShadowPrefs.localStorage.get_host_from_url(httpChannel.URI.host) != ShadowPrefs.localStorage.httpChannel_get_host(getCurrentTab(httpChannel).id)){
            
      //clear referrer
      var referrer = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI("https://nothing.org", "", null);
          
      httpChannel.setReferrerWithPolicy(referrer, httpChannel.REFERRER_POLICY_NO_REFERRER);
          
      return httpChannel;
              
    }
          
  }
  catch(e){
  
    console.log("ERROR clearing http_referer: " + e);
  
    return httpChannel;
            
  }
  
  return httpChannel;

}

function clear_tabName(httpChannel){

  if(ShadowPrefs.localStorage.is_different_domain_httpChannel(httpChannel.URI.spec, getCurrentTab(httpChannel).id)){
            
    try{
            
      var options = {
        contentScript: 'if(window.name != \'\'){ window.name = \'\'; }'
      };
            
      let { Worker } = require("sdk/tabs/worker");
      Worker(options,
        //require("sdk/tabs/utils").getTabContentWindow(getCurrentTab(httpChannel))
        // dont using the above line cause its causing errors, using our own way... (which does exactly the same as far as i know)
        getTabBrowser(httpChannel).contentWindow
            
      );
            
    }
    catch(e){
            
      console.log("ERROR clearing tab.name: " + e);
            
    }
          
  }

}

function clear_localStorage(httpChannel){

  if(ShadowPrefs.localStorage.is_different_domain_httpChannel(httpChannel.URI.spec, getCurrentTab(httpChannel).id) && ShadowPrefs.localStorage.httpChannel_should_clear(httpChannel.URI.spec)){
  
    try{
    
      var options = {
        contentScriptFile: require("sdk/self").data.url("js/localStorage.js")
      };
      
      let { Worker } = require("sdk/tabs/worker");
      Worker(options,
        getTabBrowser(httpChannel).contentWindow
      );
      
      ShadowPrefs.localStorage.httpChannel_cleared(httpChannel.URI.spec);
    
    }
    catch(e){
    
      console.log("ERROR clearing storages: " + e);
    
    }
  
  }

}

/*
* The observer to get the 'http-on-examine-response' trigger used to intercept
* incoming HTTP Headers (so we can remove the 'WWW-Authenticate' Header flag
* to block the Authentication-ID security flaw if it is set by a third party Website)
*/
var httpRequestObserver = {

  isObserving: false,

  /*
  * This function executes when the Observer gets triggered
  */
  observe: function(subject, topic, data, ShadowPrefs){

    // If it is a Server->Client Response
    if(topic == "http-on-examine-response") {

      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

      var parentHost = getParentHost(httpChannel);

      // If it is a third party Website/Host
      if(parentHost && parentHost != httpChannel.URI.host){

        // If the 'WWW-Authenticate' Header is set
        try{
          if(httpChannel.getResponseHeader("WWW-Authenticate") != 0x80040111){
          
            if(getShadowPref().SPref.getSPValue("protect_auth_id", 1)){
            
              console.log("[i] Blocked Auth-ID: " + httpChannel.getResponseHeader("WWW-Authenticate"));

              httpChannel.setResponseHeader("WWW-Authenticate", null, false);
            
            }

          }
        }
        catch(e){
          if(e.result == Cr.NS_ERROR_NOT_AVAILABLE){
            // this silences the NS_ERROR_NOT_AVAILABLE message
          }
          else{
            console.log("observe() encountered a strange error: " + e);
          }
        }

      }

    }
    else if(topic == "http-on-modify-request"){

      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

      var parentHost = getParentHost(httpChannel);

      // If its a third-party Website
      if(parentHost && parentHost != httpChannel.URI.host){

          if(getShadowPref().SPref.getSPValue("hide_referer", 1)){
          
            httpChannel = clearReferer(httpChannel);
          
          }
          
          if(getShadowPref().SPref.getSPValue("protect_tab_name", 1)){
          
            clear_tabName(httpChannel);
          
          }
          
          if(getShadowPref().SPref.getSPValue("protect_local_session_storage", 1)){
          
            clear_localStorage(httpChannel);
          
          }

      }
      else if(parentHost && parentHost == httpChannel.URI.host){
          //update this later for custom proxy settings
          if(require("sdk/preferences/service").get("extensions.jondofox.proxy.choice") == "jondo"){
            
              try{
              
                  if(getShadowPref().SPref.getSPValue("stateless_http_session", 1)){
                  
                    httpChannel.setRequestHeader("Proxy-Connection", "close", false);
                    httpChannel.setRequestHeader("Connection", "close", false);
                  
                  }
              
              }
              catch(e){
              }
          
          }
          
          if(getShadowPref().SPref.getSPValue("hide_referer", 1)){
          
            httpChannel = clearReferer(httpChannel);
          
          }
          
          if(getShadowPref().SPref.getSPValue("protect_tab_name", 1)){
          
            clear_tabName(httpChannel);
          
          }
          
          if(getShadowPref().SPref.getSPValue("protect_local_session_storage", 1)){
          
            clear_localStorage(httpChannel);
          
          }
      
      }

      //If Content-Type Header is not correctly set
      try{
         if(httpChannel.getRequestHeader("Accept") != "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"){
         
           if(getShadowPref().SPref.getSPValue("fake_http_contenttype_header", 1)){
           
             httpChannel.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false);
           
           }

         }
      }
      catch(e){
        if(e.result == Cr.NS_ERROR_NOT_AVAILABLE){
          // this silences the NS_ERROR_NOT_AVAILABLE message
        }
        else{
          console.log("observer() encountered a strange error: " + e);
        }
      }

    }

  },

  get observerService(){
    return Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
  },

  register: function(ShadowPrefs){
    this.observerService.addObserver(this, "http-on-examine-response", false);
    this.observerService.addObserver(this, "http-on-modify-request", false);
    this.isObserving = true;
    saveShadowPrefs(ShadowPrefs);
  },

  unregister: function(){
    this.observerService.removeObserver(this, "http-on-examine-response");
    this.observerService.removeObserver(this, "http-on-modify-request");
    this.isObserving = false;
  },

  checkObservingState: function(){
    return this.isObserving;
  }

};

exports.httpRequestObserver = httpRequestObserver;
