var state;

$( document ).ready(function() {
  // init preferences
  $("#JonDoFoxLite_privateBrowsing").on( "click", function(event) {
    var jsonParamters = { "privateBrowsing" : true };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });

  $("#JonDoFoxLite_openOptions").on( "click", function(event) {
    var jsonParamters = { "option" : true };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });

  $("input[name='proxyChoice']").change(function(){
    var jsonParamters = { "proxyChoice" : $(this).val() };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });

});

// Listener for ContentScript
window.addEventListener('menuAction', function(event) {
  console.log("Listener for ContentScript");
  console.log(event.data);
  if(null != event.data.JonDoFoxLite_isEnabled){
    console.log(event.data.JonDoFoxLite_isEnabled);
    state = event.data.JonDoFoxLite_isEnabled ;  // Message from content script
  }
}, false);
