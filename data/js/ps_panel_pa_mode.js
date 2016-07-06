$( document ).ready(function() {



  // init preferences
  $("#JonDoFoxLite_panelPAMode_OK").on( "click", function(event) {
    var rememberPAMode = $("#rememberPAMode").is(":checked") ? "true" : "false";

    var jsonParamters = { "PAMODE" : true ,
                          "rememberPAMode" : rememberPAMode
   };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });

  $("#JonDoFoxLite_panelPAMode_CANCEL").on( "click", function(event) {
    var jsonParamters = { "PAMode" : false };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });


});

// Listener for ContentScript
window.addEventListener('panelPAMode', function(event) {
  console.log("Listener for ContentScript");
  console.log(event.data);
  if(null != event.data.JonDoFoxLite_isEnabled){
    console.log(event.data.JonDoFoxLite_isEnabled);
    state = event.data.JonDoFoxLite_isEnabled ;  // Message from content script
  }
}, false);
