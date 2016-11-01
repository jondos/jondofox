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

  $("input[name='proxy.choice']").change(function(){
    var jsonParamters = { "proxyChoice" : $(this).val() };
    window.postMessage(jsonParamters , "*");
    console.log(jsonParamters);
    event.stopPropagation();
  });

console.log(navigator.language);

// Listener for ContentScript
window.addEventListener('menuAction', function(event) {
  console.log("Listener for ContentScript");
  console.log(event.data);
  if(null != event.data.proxyChoice){
    console.log(event.data.proxyChoice);
    value = event.data.proxyChoice ;  // Message from content script
    console.log("Init Proxy with : " + value )
  }
}, false);

window.addEventListener('message', function(event) {
        var messageArray = event.data;
        var messageValue = messageArray[0]
        window.document.querySelector('input[value="' + messageValue["proxy.choice"] + '"]').checked = true;
        console.log(messageValue["proxy.isPrivateBrowsing"]);
        if(messageValue["proxy.isPrivateBrowsing"]){
          var inputsProxyChoice = window.document.querySelectorAll('input[name="proxy.choice"]');
          for (index = 0; index < inputsProxyChoice.length; ++index) {
              inputsProxyChoice[index].disabled=false;
          }
        }else{
          for (index = 0; index < inputsProxyChoice.length; ++index) {
              inputsProxyChoice[index].disabled=true;
          }
        }
      }, false);

});
