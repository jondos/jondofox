$( document ).ready(function() {

  // Side Nav

  $(".button-collapse").sideNav();

  // Scrollspy

  $('.scrollspy').scrollSpy();

  // button click
  $(".btn").click(function(){
          var elementId=this.id;
          var options = {
            "preferences" : {},
            "proxy" : {} ,
            "email"  : {}
          };
          switch(elementId) {
              case "proxySubmit":
                  var elements = document.querySelectorAll('[name^="proxy.custom."]');
                  for(key in elements){
                    if (typeof elements[key] !== 'function') {
                      var element = elements[key];

                      if (element.type == "text") {
                        var val = elements[key].value;
                        var reg = new RegExp('^[0-9]+$');
                        var isnum = reg.test(elements[key].value);
                        if(isnum){
                          options.proxy[elements[key].name] = parseInt(elements[key].value);
                        }else{
                          options.proxy[elements[key].name] = elements[key].value;
                        }
                      }
                      if (element.type == "checkbox") {
                        if(elements[key].checked){
                          options.proxy[elements[key].name] = true;
                        }else{
                          options.proxy[elements[key].name] = false;
                        }
                      }
                      if (element.type == "radio") {
                        if(elements[key].checked){
                          options.proxy[elements[key].name] = elements[key].value;
                        }
                      }
                    }
                  }
                  window.postMessage(options , "*");
                  break;
              case "preferencesSubmit":
                  // to do
                  break;
              case "emailSubmit":
                  // to do
              break;
              case "proxyCancel":
                  location.reload();
              break;

          }


  });

  // menu scrollto

  $("#side-nav li a[href^='#']").on('click', function(e) {

     // prevent default anchor click behavior
     e.preventDefault();

     // store hash
     var hash = this.hash;

     // animate
     $('html, body').animate({
         scrollTop: $(hash).offset().top
       }, 300, function(){

         // when done, add hash to url
         // (default click behaviour)
         window.location.hash = hash;
       });

});

  // preferences init




  // preferences save



});



// Listener for ContentScript
window.addEventListener('message', function(event) {
  //document.getElementById("JonDoFoxLite_isEnabled").checked = event.data ;  // Message from content script
  // get Arrays

  console.log("message:");
  console.log(event.data);
  var options = event.data;
  var proxy = options["proxy"];
  var email = options["email"];
  var preferences = options["preferences"];

  for (var key in proxy){

    if (typeof proxy[key] !== 'function' && key != "" && key != null && key != undefined ) {
      //var tmpString = "[name="+ key.toString() +"]";

      var elements = document.querySelectorAll('[name="' + key + '"]');
      for(var element in elements){

        if (typeof elements[element] !== 'function' && elements[element] != "" && elements[element] != null && elements[element] != undefined ) {
          if (elements[element].type == "text") {
            if(!!proxy[key]){
              elements[element].value = proxy[key];
              var labels = document.querySelectorAll('[for="' + key + '"]');
              var label = labels[0];
              var className = " active ";
              if ( (" " + label.className + " ").replace(/[\n\t]/g, " ").indexOf(" active ") > -1 ){}
            }
          }
          if (elements[element].type == "checkbox") {
            elements[element].checked =  proxy[key];
          }
          if (elements[element].type == "radio") {
            if(elements[element].value == proxy[key]){
              elements[element].checked = true;

            }
          }
        }
      }
    }
  }





}, false);
