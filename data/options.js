self.port.on("preferences", function(preferences) {
  console.log("From AddonScript to ContentScript " + preferences);
  window.postMessage(preferences, "*");
});

window.addEventListener('message', function(event) {
  console.log("From PageScript to ContentScript: " + event.data);
  self.port.emit("preferences", event.data);
}, false);
