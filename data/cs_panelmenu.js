self.port.on("menuAction", function(menuAction) {
  console.log("Panelmenu From AddonScript to ContentScript ");
  console.log(menuAction);
  window.postMessage(menuAction, "*");
});

window.addEventListener('message', function(event) {
  console.log("Panelmenu From PageScript to ContentScript: " + event.data);
  self.port.emit("menuAction", event.data);
}, false);
