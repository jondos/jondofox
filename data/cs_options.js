self.port.on("preferences", function(preferences) {
  window.postMessage(preferences, "*");
});

window.addEventListener('message', function(event) {
  self.port.emit("pOptions", event.data);
}, false);
