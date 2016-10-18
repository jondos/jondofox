function storageAvailable(type){

  try{
  
    var storage = window[type], x = '__storage_test__';
    
    storage.setItem(x, x);
    storage.removeItem(x);
    
    return true;
  
  }
  catch(e){
  
    return false;
  
  }

}

if(storageAvailable('localStorage') && storageAvailable('sessionStorage')){

  var localstorage = window['localStorage'];
  var sessionstorage = window['sessionStorage'];
  
  try{
  
    localstorage.clear();
    sessionstorage.clear();
    
    self.port.emit("proceed", "YES");
  
  }
  catch(e){
  
    self.port.emit("proceed", e);
  
  }

}
else{

  self.port.emit("proceed", "NO");

}