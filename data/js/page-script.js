$( document ).ready(function() {
  // init preferences

  $("#JonDoFoxLite_isEnabled").click(function() {
    var boolean = $('#JonDoFoxLite_isEnabled').prop('checked');
    window.postMessage(boolean , "*");
    console.log(boolean);
  });

});

// Listener for ContentScript
window.addEventListener('message', function(event) {
  document.getElementById("JonDoFoxLite_isEnabled").checked = event.data ;  // Message from content script
}, false);
