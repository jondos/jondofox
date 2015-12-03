var main = require("../index.js");
var observer = require("../observer.js");

var {Cc, Ci, Cr, components} = require("chrome");

function creatensIHttpChannel(url, authid, referrer){

  var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var uri = ios.newURI(url, null, null);
  var ch = ios.newChannelFromURI(uri);
  var fake_uri = ios.newURI(referrer, null, null);
  
  /*
  * The following three lines must be in this order, else all the whole test is failing
  */
  var channel = ch.QueryInterface(Ci.nsIHttpChannel);
  
  channel.referrer = fake_uri;
  
  ch.open();
  
  channel.setResponseHeader("WWW-Authenticate", authid, false);
  
  return channel;

}

/*
* If you put capital letters inside the [] like: ["Hello"]
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

  var channel_with_external_id = creatensIHttpChannel("http://www.google.de/", "Test-ID", "http://www.google-fake.de/");
  var channel_with_internal_id = creatensIHttpChannel("http://www.google.de/", "Test-ID", "http://www.google.de/");
  
  observer.httpRequestObserver.observe(channel_with_external_id.QueryInterface(Ci.nsISupports), "http-on-examine-response", channel_with_external_id);
  observer.httpRequestObserver.observe(channel_with_internal_id.QueryInterface(Ci.nsISupports), "http-on-examine-response", channel_with_internal_id);
  
  try{
    console.log("AUTHID: " + channel_with_external_id.getResponseHeader("WWW-Authenticate"));
  }
  catch(e){
    if(e.result == Cr.NS_ERROR_NOT_AVAILABLE){
    
      try{
        var test = channel_with_internal_id.getResponseHeader("WWW-Authenticate");
        
        assert.equal(true, true, "working");
        done();
      }
      catch(ee){
      
        console.log("Failed while setting a Auth-ID on a first party site: " + ee);
      
        assert.equal(true, false, "failed");
        done();
      
      }
      
    }
    else{
      
      console.log("Failed while setting a Auth-ID on a third party site: " + e);
      
      assert.equal(true, false, "failed");
      done();
      
    }
  }

}

/*
* Actually runs the test
*/
require("sdk/test").run(exports);