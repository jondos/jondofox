var {Cc, Ci, Cr} = require("chrome");
var preferences = require("./preferences.js");


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

  return wind;

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

      parentHost = wind.top.location.hostname;

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
* The observer to get the 'http-on-examine-response' trigger used to intercept
* incoming HTTP Headers (so we can remove the 'WWW-Authenticate' Header flag
* to block the Authentication-ID security flaw if it is set by a third party Website)
*/
var httpRequestObserver = {

  isObserving: false,

  /*
  * This function executes when the Observer gets triggered
  */
  observe: function(subject, topic, data){

    // If it is a Server->Client Response
    if(topic == "http-on-examine-response") {

      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

      var parentHost = getParentHost(httpChannel);

      // If it is a third party Website/Host
      if(parentHost && parentHost != httpChannel.URI.host){

        // If the 'WWW-Authenticate' Header is set
        try{
          if(httpChannel.getResponseHeader("WWW-Authenticate") != 0x80040111){

            console.log("[i] Blocked Auth-ID: " + httpChannel.getResponseHeader("WWW-Authenticate"));

            httpChannel.setResponseHeader("WWW-Authenticate", null, false);

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

        // handle window.name
        var wind = getDOMWindow(httpChannel);

        if(wind && wind.name != ''){

          console.log("window.name: removed saved values. (" + wind.name + ")");

          wind.name = '';

        }

      }

      //If Content-Type Header is not correctly set
      try{
         if(httpChannel.getRequestHeader("Accept") != "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"){
           httpChannel.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false);

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

  register: function(){
    this.observerService.addObserver(this, "http-on-examine-response", false);
    this.observerService.addObserver(this, "http-on-modify-request", false);
    this.isObserving = true;
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
exports.onPrefChange = onPrefChange;
