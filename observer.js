var {Cc, Ci, Cr} = require("chrome");

/*
* Should be fired when a preference get changed
*/
function onPrefChange(prefName){

  if(prefName == "JonDoFoxLite_isEnabled"){
    if(require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
    
      httpRequestObserver.register();
      
        /*
        * This is just for testing purpose and yet buggy
        */
        require("sdk/notifications").notify({
          title: "JonDoFox Lite Enabled",
          test: "You have enabled the Addon, i like this!",
          data: "Addon enabled",
          onClick: function(data){
            console.log(data);
          }
        });
      
    }
    else if(!require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
    
      httpRequestObserver.unregister();
      
        /*
        * This is just for testing purpose and yet buggy
        */
        require("sdk/notifications").notify({
          title: "JonDoFox Lite Disabled",
          test: "You have disabled the Addon, now you will not be protected anymore!",
          data: "Addon disabled",
          onClick: function(data){
            console.log(data);
          }
        });
      
    }
  }

}

/*
* The observer to get the 'http-on-modify-request' trigger used to intercept
* incoming HTTP Headers (so we can remove the 'Authorization' Header flag
* to block the Authentication-ID security flaw)
*/
var httpRequestObserver = {
  
  /*
  * This function executes when the Observer gets triggered
  */
  observe: function(subject, topic, data){
  
    if(topic == "http-on-modify-request") {
    
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      
      try{
        if(httpChannel.getRequestHeader("Authorization") != 0x80040111){
      
          console.log("[i] Blocked Authentication-ID: " + httpChannel.getRequestHeader("Authorization"));
          console.log("[i] Blocked from Host:         " + httpChannel.getRequestHeader("Host"));
      
          httpChannel.setRequestHeader("Authorization", "", false);
        
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
    
  },
  
  get observerService(){
    return Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
  },
  
  register: function(){
    this.observerService.addObserver(this, "http-on-modify-request", false);
  },
  
  unregister: function(){
    this.observerService.removeObserver(this, "http-on-modify-request");
  }
  
};

exports.httpRequestObserver = httpRequestObserver;
exports.onPrefChange = onPrefChange;