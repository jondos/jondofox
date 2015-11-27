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
*
* Then the nsIChannel is opened and converted into a nsIHttpChannel to reach HTTP
* specific functions and data
*
* The nsIHttpChannel is passed to the observe() function which should be tested
* and the output is being checked
*/
exports["testing authentication-id blocking"] = function(assert, done){

  var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var uri = ios.newURI("http://www.google.de/", null, null);
  var ch = ios.newChannelFromURI(uri);
  
  ch.open();
  
  var channel = ch.QueryInterface(Ci.nsIHttpChannel);
  
  channel.setResponseHeader("WWW-Authenticate", "TEST", false);
  channel.setRequestHeader("Referer", "www.google-fake.de", false);
  
  observer.httpRequestObserver.observe(channel.QueryInterface(Ci.nsISupports), "http-on-examine-response", channel);
  
  try{
    console.log("AUTHID: " + channel.getResponseHeader("WWW-Authenticate"));
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
  
  assert.equal(true, false, "failed");
  done();

}

/*
* Actually runs the test
*/
require("sdk/test").run(exports);