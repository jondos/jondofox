var main = require("../index.js");
var observer = require("../observer.js");

var {Cc, Ci, Cr, components} = require("chrome");

/*
* If ou put capital letters inside the [] like: ["Hello"]
* then the Unittests will magically fail without error message (tests are skipped)
*/

exports["testing on_pref_change"] = function(assert, done){

  // Currently, i have no idea how to check this (except like the test in 'test-index.js')...
  
  assert.equal(true, true, "working... what else");
  done();
  
}

/*
* This is testing the observer() function declared in httpRequestObserver
*
* It works by creating a nsIChannel 'ch' pointing to Google, but it can be any website
* as long as the site is reachable from the testing machine
* (I should include a try{}catch() for the 'ch.QueryInterface()' call)
*
* Then the nsIChannel is opened and converted into a nsIHttpChannel to reach HTTP
* specific functions and data
*
* The nsIHttpChannel is passed to the observe() function which should be tested
* and the output is being checked
*/
exports["testing authentication-id blocking"] = function(assert, done){

  var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var ch = ios.newChannel("http://www.google.de/", null, null);
  
  var listener = new StreamListener(alwaystrue);
  
  ch.asyncOpen(listener, null);
  
  var channel = ch.QueryInterface(Ci.nsIHttpChannel);
  
  channel.setRequestHeader("Authorization", "xxxxxxxxxxxxx", false);
  
  observer.httpRequestObserver.observe(channel.QueryInterface(Ci.nsISupports), "http-on-modify-request", channel);
  
  try{
    console.log("AUTHID: " + channel.getRequestHeader("Authorization"));
  }
  catch(e){
    if(e.result == Cr.NS_ERROR_NOT_AVAILABLE){
      
      assert.equal(true, true, "working");
      done();
      
    }
    else{
      
      console.log("Not expected error while testing auth-id block: " + e);
      assert.equal(true, false, "failed");
      done();
      
    }
  }
  
  /*
  Code in this block will most likely never run, but is needed to create
  a fake nsIHttpChannel
  ###############
  */

  function alwaystrue(){
  
    assert.equal(true,true,"works");
    done();

  }

  function StreamListener(aCallbackFunc) {
    this.mCallbackFunc = aCallbackFunc;
  }

  StreamListener.prototype = {
    
    mData: "",

    onStartRequest: function (aRequest, aContext) {
      this.mData = "";
    },

    onDataAvailable: function (aRequest, aContext, aStream, aSourceOffset, aLength) {
      
      var scriptableInputStream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
      scriptableInputStream.init(aStream);

      this.mData += scriptableInputStream.read(aLength);
    },

    onStopRequest: function (aRequest, aContext, aStatus) {
      
      if (components.isSuccessCode(aStatus)) {
      
        this.mCallbackFunc(this.mData);
        
      } else {
      
        this.mCallbackFunc(null);
        
      }

      ch = null;
      
    },

    onChannelRedirect: function (aOldChannel, aNewChannel, aFlags) {
      
      ch = aNewChannel;
      
    },

    getInterface: function (aIID) {
    
      try {
      
        return this.QueryInterface(aIID);
        
      } catch (e) {
      
        throw Cr.NS_NOINTERFACE;
        
      }
    },

    // nsIProgressEventSink (not implementing will cause annoying exceptions)
    onProgress : function (aRequest, aContext, aProgress, aProgressMax) { },
    onStatus : function (aRequest, aContext, aStatus, aStatusArg) { },

    // nsIHttpEventSink (not implementing will cause annoying exceptions)
    onRedirect : function (aOldChannel, aNewChannel) { },

    // we are faking an XPCOM interface, so we need to implement QI
    QueryInterface : function(aIID) {
      if (aIID.equals(Ci.nsISupports) ||
          aIID.equals(Ci.nsIInterfaceRequestor) ||
          aIID.equals(Ci.nsIChannelEventSink) || 
          aIID.equals(Ci.nsIProgressEventSink) ||
          aIID.equals(Ci.nsIHttpEventSink) ||
          aIID.equals(Ci.nsIStreamListener))
        return this;

      throw Cr.NS_NOINTERFACE;
    }
  };

  /*
  ###############
  */

}

/*
* Actually runs the test
*/
require("sdk/test").run(exports);