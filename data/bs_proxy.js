var proxyService = {
  initShadowProxyCopy : function initialShadowCopyProxy(){
    // check if JonDoFoxLite_isEnabled is true (on) and make copy of init prefs / switch to the
    if(require("sdk/simple-prefs").prefs.JonDoFoxLite_isEnabled){
      createCustomBackup();
    }
  },
  setProxy : function setProxy(pProxyName){
    require("sdk/notifications").notify({
      text: "Im Privaten Modus surfen sie nun mit dem Proxy :" + pProxyName
    });
    switch (pProxyName) {
      case "custom":
        setCustomProxy();
        require("sdk/simple-prefs").prefs.JonDoFoxLite_proxyChoice = 1;
      break;
      case "tor":
        setTorProxy();
        require("sdk/simple-prefs").prefs.JonDoFoxLite_proxyChoice = 2;
      break;
      case "jondo":
        setJonDoFoxProxy();
        require("sdk/simple-prefs").prefs.JonDoFoxLite_proxyChoice = 3;
      break;
      default:
        setCustomBackupProxy();
        require("sdk/simple-prefs").prefs.JonDoFoxLite_proxyChoice = 0;
      break;

    }
  }

}

// Create inital backup from custom proxy settings
function createCustomBackup(){
  require("sdk/simple-prefs").prefs.custom_backup_ssl_host = require("sdk/preferences/service").get("network.proxy.ssl");
  require("sdk/simple-prefs").prefs.custom_backup_ssl_port = require("sdk/preferences/service").get("network.proxy.ssl_port");
  require("sdk/simple-prefs").prefs.custom_backup_ftp_host = require("sdk/preferences/service").get("network.proxy.ftp");
  require("sdk/simple-prefs").prefs.custom_backup_ftp_port = require("sdk/preferences/service").get("network.proxy.ftp_port");
  //require("sdk/simple-prefs").prefs.custom_backup_gopher_host = require("sdk/preferences/service").get("network.proxy.ssl");
  //require("sdk/simple-prefs").prefs.custom_backup_gopher_port = require("sdk/preferences/service").get("network.proxy.ssl");
  require("sdk/simple-prefs").prefs.custom_backup_socks_host = require("sdk/preferences/service").get("network.proxy.socks");
  require("sdk/simple-prefs").prefs.custom_backup_socks_port = require("sdk/preferences/service").get("network.proxy.socks_port");
  require("sdk/simple-prefs").prefs.custom_backup_socks_version = require("sdk/preferences/service").get("network.proxy.socks_version");
}
// Set proxy preference to Custom Backup
function setCustomBackupProxy(){
  require("sdk/preferences/service").set("network.proxy.ssl",  require("sdk/simple-prefs").prefs.custom_backup_ssl_host);
  require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/simple-prefs").prefs.custom_backup_ssl_port );
  require("sdk/preferences/service").set("network.proxy.ftp_host" , require("sdk/simple-prefs").prefs.custom_backup_ftp_host);
  require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/simple-prefs").prefs.custom_backup_ftp_port);
  //require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/simple-prefs").prefs.custom_backup_gopher_host);
  //require("sdk/preferences/service").set("network.proxy.ssl", require("sdk/simple-prefs").prefs.custom_backup_gopher_port);
  require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/simple-prefs").prefs.custom_backup_socks_host);
  require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/simple-prefs").prefs.custom_backup_socks_port);
  require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/simple-prefs").prefs.custom_backup_socks_version);
}
// Set proxy preference to Custom
function setCustomProxy(){
  require("sdk/preferences/service").set("network.proxy.http",  require("sdk/simple-prefs").prefs.custom_http_host);
  require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/simple-prefs").prefs.custom_http_port);
  require("sdk/preferences/service").set("network.proxy.ssl_host",  require("sdk/simple-prefs").prefs.custom_ssl_host);
  require("sdk/preferences/service").set("network.proxy.ssl_port",  require("sdk/simple-prefs").prefs.custom_ssl_port);
  require("sdk/preferences/service").set("network.proxy.ftp",  require("sdk/simple-prefs").prefs.custom_ftp_host);
  require("sdk/preferences/service").set("network.proxy.ftp_port",  require("sdk/simple-prefs").prefs.custom_ftp_port);
  //require("sdk/preferences/service").set("network.proxy.gopher_host",  require("sdk/simple-prefs").prefs.custom_gopher_host);
  //require("sdk/preferences/service").set("network.proxy.gopher_port",  require("sdk/simple-prefs").prefs.custom_gopher_port);
  require("sdk/preferences/service").set("network.proxy.socks",  require("sdk/simple-prefs").prefs.custom_socks_host);
  require("sdk/preferences/service").set("network.proxy.socks_port",  require("sdk/simple-prefs").prefs.custom_socks_port);
  require("sdk/preferences/service").set("network.proxy.socks_version",  require("sdk/simple-prefs").prefs.custom_socks_version);
  require("sdk/preferences/service").set("network.proxy.share_proxy_settings",  require("sdk/simple-prefs").prefs.custom_share_proxy_settings);
}
// Set procy to JonDoFox proxy
function setJonDoFoxProxy(){
  require("sdk/preferences/service").set("network.proxy.http",  require("sdk/simple-prefs").prefs.jondo_host);
  require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/simple-prefs").prefs.jondo_port);
}
// Set proxy to Tor proxy
function setTorProxy(){
  require("sdk/preferences/service").set("network.proxy.http",  require("sdk/simple-prefs").prefs.tor_http_host);
  require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/simple-prefs").prefs.tor_http_port);
  require("sdk/preferences/service").set("network.proxy.ssl",  require("sdk/simple-prefs").prefs.tor_ssl_host);
  require("sdk/preferences/service").set("network.proxy.ssl_host",  require("sdk/simple-prefs").prefs.tor_ssl_port);
  require("sdk/preferences/service").set("network.proxy.socks",  require("sdk/simple-prefs").prefs.tor_socks_host);
  require("sdk/preferences/service").set("network.proxy.socks_port",  require("sdk/simple-prefs").prefs.tor_socks_port);
}
exports.proxyService = proxyService;
