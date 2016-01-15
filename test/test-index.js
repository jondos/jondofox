var main = require("../index.js");

/*
* If you put capital letters inside the [] like: ["Hello"]
* then the Unittests will magically fail without error message (tests are skipped)
*/
exports["testing addon enable/disable..."] = function(assert){
  
  require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled = true;
  
  if(require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
    
    main.handleClick();
    
    if(!require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
    
      main.handleClick();
      
      if(require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
        
        assert.equal(true, true, "working");
        
      }
      else{
        
        assert.equal(true, false, "failed");
        
      }
      
    }
    else{
    
      assert.equal(true, false, "failed");
      
    }
  }
}

require("sdk/test").run(exports);
