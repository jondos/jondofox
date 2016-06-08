$( document ).ready(function() {
  // init preferences

  $("#JonDoFoxLite_isEnabled").click(function() {
    var boolean = $('#JonDoFoxLite_isEnabled').prop('checked');
    window.postMessage(boolean , "*");
    console.log(boolean);
  });
  // Init tab functionality
  $('.menu-tabs a').click(function(){
		var tab_id = $(this).attr('href');

		$('.menu-tabs a').removeClass('active');
		$('.tab-content').css('display','none');

		$(this).addClass('active');
		$(tab_id).css('display','block');
	})


});

// Listener for ContentScript
window.addEventListener('message', function(event) {
  document.getElementById("JonDoFoxLite_isEnabled").checked = event.data ;  // Message from content script
}, false);
