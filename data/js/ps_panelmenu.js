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



// Listener for ContentScript
window.addEventListener('menuAction', function(event) {
  console.log("Listener for ContentScript");
  console.log(event.data);
  if(null != event.data.proxyChoice){
    value = event.data.proxyChoice ;  // Message from content script
  }
}, false);

window.addEventListener('message', function(event) {
        var messageArray = event.data;
        var messageValue = messageArray[0]
        window.document.querySelector('input[value="' + messageValue["proxy.choice"] + '"]').checked = true;

        console.log(messageValue["proxy.isPrivateBrowsing"]);
        var inputsProxyChoice = window.document.querySelectorAll('input[name="proxy.choice"]');
        if(messageValue["proxy.isPrivateBrowsing"] == "true" || messageValue["proxy.isPrivateBrowsing"] == true){
          for (index = 0; index < inputsProxyChoice.length; ++index) {
              inputsProxyChoice[index].disabled=false;
          }
        }
        if(messageValue["proxy.isPrivateBrowsing"] == "false" || messageValue["proxy.isPrivateBrowsing"] == false){
          for (index = 0; index < inputsProxyChoice.length; ++index) {

              inputsProxyChoice[index].disabled= true;
          }
        }
      }, false);

});

function hrefAnonimityTest(){
  language = navigator.language;
  if(language == "de"){
    openInNewTab('http://ip-check.info/?lang=de');
  }else{
    openInNewTab('http://ip-check.info/?lang=en');
  }
}

function openInNewTab(url) {
  var win = window.open(url, "_newtab");
  win.focus();
}
