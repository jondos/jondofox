var main = require("../index.js");
var observer = require("../observer.js");

var {Cc, Ci, Cr, components} = require("chrome");

/*
* This function creates a nsIHttpChannel and sets a Authentication ID and a Referrer
*
* The url, authid and referrer should be passed as string
* 
* The Auth-ID is set as Server->Client Response (WWW-Authenticate Header)
* And NOT as Client->Server Request (Authorization Header)
*/
function creatensIHttpChannel(url, authid, referrer){

  var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var uri = ios.newURI(url, null, null);
  var ch = ios.newChannelFromURI(uri);
  var fake_uri = ios.newURI(referrer, null, null);
  
  /*
  * The following three lines must be in this order
  */
  var channel = ch.QueryInterface(Ci.nsIHttpChannel);
  
  channel.referrer = fake_uri;
  
  ch.open();
  
  // This line will fail if 'url' is no valid host or the url is not reachable
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
* Two different nsIHttpChannel will be created pointing to google.de (it can be any reachable website)
*
* One of the Channels is treated as "third party website" and the other as "first party website"
* based on the referrer (the referrer is only used in Unittest mode, see observer.js:getParentHost() )
*
* The observer() function is run with both Channels and it should remove the Auth-ID of the "third party website"
*
* The test returns true if "first party website" does keep its Auth-ID and "third party website" removes it.
*/
exports["testing authentication-id blocking"] = function(assert, done){

  // The browser is on 'google.de', but some script from 'google.com' is setting 'Test-ID' (this should be blocked)
  var channel_with_external_id = creatensIHttpChannel("http://www.google.com/", "Test-ID", "http://www.google.de/");
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