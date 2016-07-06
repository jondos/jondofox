self.port.on("panelPAMode", function(menuAction) {
  console.log("panelPAMode From AddonScript to ContentScript ");
  console.log(menuAction);
  window.postMessage(panelPAMode, "*");
});

window.addEventListener('message', function(event) {
  console.log("panelPAMode From PageScript to ContentScript: " + event.data);
  self.port.emit("panelPAMode", event.data);
}, false);
