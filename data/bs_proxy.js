var proxyService = {

  proxy_prefs: [],

  setProxy : function setProxy(pProxyName){
    switch (pProxyName) {
      case "no":
        this.setNoProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , pProxyName);
      break;
      case "default":
       this.setDefaultProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , pProxyName);
      break;
      case "custom":
        this.setCustomProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , pProxyName);
      break;
      case "jondo":
        this.setCustomProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , pProxyName);
      break;
      case "tor":
        this.setTorProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , pProxyName);
      break;
      default:
        this.setDefaultProxy();
        require("sdk/preferences/service").set("extensions.jondofox.proxy.choice" , "default");
      break;

    }
  },

  createDefaultBackup : function createDefaultBackup(){
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.autoconfig_retry_interval_max" , require("sdk/preferences/service").get("network.proxy.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("network.proxy.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.autoconfig_url" , require("sdk/preferences/service").get("network.proxy.autoconfig_url"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.failover_timeout" , require("sdk/preferences/service").get("network.proxy.failover_timeout"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.ftp" , require("sdk/preferences/service").get("network.proxy.ftp"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.ftp_port" , require("sdk/preferences/service").get("network.proxy.ftp_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.http",  require("sdk/preferences/service").get("network.proxy.http"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.http_port",  require("sdk/preferences/service").get("network.proxy.http_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.no_proxies_on" , require("sdk/preferences/service").get("network.proxy.no_proxies_on"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.proxy_over_tls" , require("sdk/preferences/service").get("network.proxy.proxy_over_tls"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.share_proxy_settings" , require("sdk/preferences/service").get("network.proxy.share_proxy_settings"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.socks" , require("sdk/preferences/service").get("network.proxy.socks"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.socks_port" , require("sdk/preferences/service").get("network.proxy.socks_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.socks_remote_dns" , require("sdk/preferences/service").get("network.proxy.socks_remote_dns"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.socks_version" , require("sdk/preferences/service").get("network.proxy.socks_version"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.ssl" , require("sdk/preferences/service").get("network.proxy.ssl"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.ssl_port" , require("sdk/preferences/service").get("network.proxy.ssl_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backup.type" , require("sdk/preferences/service").get("network.proxy.type"));
  },

  createDefaultProxy : function createDefaultProxy(){
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.backautoconfig_retry_interval_max" , require("sdk/preferences/service").get("network.proxy.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("network.proxy.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.autoconfig_url" , require("sdk/preferences/service").get("network.proxy.autoconfig_url"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.failover_timeout" , require("sdk/preferences/service").get("network.proxy.failover_timeout"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.ftp" , require("sdk/preferences/service").get("network.proxy.ftp"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.ftp_port" , require("sdk/preferences/service").get("network.proxy.ftp_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.http",  require("sdk/preferences/service").get("network.proxy.http"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.http_port",  require("sdk/preferences/service").get("network.proxy.http_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.no_proxies_on" , require("sdk/preferences/service").get("network.proxy.no_proxies_on"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.proxy_over_tls" , require("sdk/preferences/service").get("network.proxy.proxy_over_tls"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.share_proxy_settings" , require("sdk/preferences/service").get("network.proxy.share_proxy_settings"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.socks" , require("sdk/preferences/service").get("network.proxy.socks"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.socks_port" , require("sdk/preferences/service").get("network.proxy.socks_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.socks_remote_dns" , require("sdk/preferences/service").get("network.proxy.socks_remote_dns"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.socks_version" , require("sdk/preferences/service").get("network.proxy.socks_version"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.ssl" , require("sdk/preferences/service").get("network.proxy.ssl"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.ssl_port" , require("sdk/preferences/service").get("network.proxy.ssl_port"));
    require("sdk/preferences/service").set("extensions.jondofox.proxy.default.type" , require("sdk/preferences/service").get("network.proxy.type"));
  },

  setNoProxy : function setNoProxy(){
    // set no proxy
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.no.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.no.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.no.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.no.default.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.no.type"));
  },

  setDefaultProxy : function setDefaultProxy(){
    // Set proxy to manuell
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.default.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.default.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.default.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.proxy.default.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.type"));
  },

  setCustomProxy : function setCustomProxy(){
    // Set proxy to manuell
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.custom.default.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.custom.type"));
  },

  setJonDoFoxProxy : function setJonDoFoxProxy(){
    // Set proxy to manuell
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.jondo.default.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.jondo.type"));
  },

  setTorProxy : function setTorProxy(){
    // Set proxy to manuell
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.tor.default.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.tor.type"));
  },

  restoreDefaultBackupProxy : function restoreDefaultBackupProxy(){
    // set no proxy
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_max"  , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.autoconfig_retry_interval_max"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_retry_interval_min" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.autoconfig_retry_interval_min"));
    require("sdk/preferences/service").set("network.proxy.autoconfig_url" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.autoconfig_url"));
    require("sdk/preferences/service").set("network.proxy.failover_timeout" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.failover_timeout"));
    require("sdk/preferences/service").set("network.proxy.ftp" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.ftp"));
    require("sdk/preferences/service").set("network.proxy.ftp_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.ftp_port"));
    require("sdk/preferences/service").set("network.proxy.http" ,  require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.http"));
    require("sdk/preferences/service").set("network.proxy.http_port",  require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.http_port"));
    require("sdk/preferences/service").set("network.proxy.no_proxies_on" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.no_proxies_on"));
    require("sdk/preferences/service").set("network.proxy.proxy_over_tls", require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.proxy_over_tls" ));
    require("sdk/preferences/service").set("network.proxy.share_proxy_settings", require("sdk/preferences/service").get("extensions.jondofox.default.backup.default.share_proxy_settings" ));
    require("sdk/preferences/service").set("network.proxy.socks" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.socks"));
    require("sdk/preferences/service").set("network.proxy.socks_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.socks_port"));
    require("sdk/preferences/service").set("network.proxy.socks_remote_dns" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.socks_remote_dns"));
    require("sdk/preferences/service").set("network.proxy.socks_version" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.socks_version"));
    require("sdk/preferences/service").set("network.proxy.ssl" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.ssl"));
    require("sdk/preferences/service").set("network.proxy.ssl_port" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.ssl_port"));
    require("sdk/preferences/service").set("network.proxy.type" , require("sdk/preferences/service").get("extensions.jondofox.proxy.default.backup.type"));
  },

  init: function init(){
    // Privacy preferences
    this.add("close.normalTabsInPrivateMode" ,  true );
    this.add("privateMode" , false);

    // Proxy preferences

    this.add("proxy.choice" , "default");

    // custrom backup preferences
    this.add("proxy.default.backup.autoconfig_retry_interval_max" ,  300 );
    this.add("proxy.default.backup.autoconfig_retry_interval_min" , 5 );
    this.add("proxy.default.backup.autoconfig_url" ,  "" );
    this.add("proxy.default.backup.failover_timeout" ,  1800 );
    this.add("proxy.default.backup.ftp" ,  "" );
    this.add("proxy.default.backup.ftp_port" ,  0);
    this.add("proxy.default.backup.http" ,  "" );
    this.add("proxy.default.backup.http_port",  0 );
    this.add("proxy.default.backup.no_proxies_on" ,  "localhost, 127.0.0.1" );
    this.add("proxy.default.backup.proxy_over_tls" ,  true );
    this.add("proxy.default.backup.share_proxy_settings" ,  false );
    this.add("proxy.default.backup.socks" ,  "" );
    this.add("proxy.default.backup.socks_port" , 0 );
    this.add("proxy.default.backup.socks_remote_dns" ,  false);
    this.add("proxy.default.backup.socks_version" ,  5 );
    this.add("proxy.default.backup.ssl" ,  "" );
    this.add("proxy.default.backup.ssl_port" ,  0 );
    this.add("proxy.default.backup.type" ,  0 );

    //Proxy preferences no
    this.add("proxy.no.backup.autoconfig_retry_interval_max" ,  300 );
    this.add("proxy.no.backup.autoconfig_retry_interval_min" ,  5 );
    this.add("proxy.no.backup.autoconfig_url" ,  "" );
    this.add("proxy.no.backup.failover_timeout" ,  1800 );
    this.add("proxy.no.backup.ftp" ,  "" );
    this.add("proxy.no.backup.ftp_port" ,  0 );
    this.add("proxy.no.backup.http" ,  "" );
    this.add("proxy.no.backup.http_port",  0 );
    this.add("proxy.no.backup.no_proxies_on" ,  "localhost, 127.0.0.1" );
    this.add("proxy.no.backup.proxy_over_tls" ,  true );
    this.add("proxy.no.backup.share_proxy_settings" ,  false );
    this.add("proxy.no.backup.socks" ,  "" );
    this.add("proxy.no.backup.socks_port" , 0 );
    this.add("proxy.no.backup.socks_remote_dns" ,  false );
    this.add("proxy.no.backup.socks_version" ,  5 );
    this.add("proxy.no.backup.ssl" ,  "");
    this.add("proxy.denofault.backup.ssl_port" ,  0 );
    this.add("proxy.no.backup.type" ,  0 );

    // Proxy preferences default
    this.add("proxy.default.autoconfig_retry_interval_max" ,  300 );
    this.add("proxy.default.autoconfig_retry_interval_min" ,  5 );
    this.add("proxy.default.autoconfig_url" ,  "" );
    this.add("proxy.default.failover_timeout" ,  1800 );
    this.add("proxy.default.ftp" ,  "" );
    this.add("proxy.default.ftp_port" ,  0 );
    this.add("proxy.default.http" ,  "" );
    this.add("proxy.default.http_port",  0 );
    this.add("proxy.default.no_proxies_on" ,  "localhost, 127.0.0.1" );
    this.add("proxy.default.proxy_over_tls" ,  true );
    this.add("proxy.default.share_proxy_settings" ,  false );
    this.add("proxy.default.socks" ,  "" );
    this.add("proxy.default.socks_port" , 0 );
    this.add("proxy.default.socks_remote_dns" ,  false );
    this.add("proxy.default.socks_version" ,  5 );
    this.add("proxy.default.ssl" ,  "" );
    this.add("proxy.default.ssl_port" ,  0  );
    this.add("proxy.default.type" ,  0 );

    // Proxy preferences custom
    this.add("proxy.custom.label" ,  "");
    this.add("proxy.custom.user_agent" ,  "normal" );
    this.add("proxy.custom.proxyKeepAlive" ,  true);
    this.add("proxy.custom.autoconfig_retry_interval_max" ,  300 );
    this.add("proxy.custom.autoconfig_retry_interval_min" ,  5 );
    this.add("proxy.custom.autoconfig_url" ,  "");
    this.add("proxy.custom.failover_timeout" ,  1800 );
    this.add("proxy.custom.ftp" ,  "" );
    this.add("proxy.custom.ftp_port" ,  0 );
    this.add("proxy.custom.http" ,  "" );
    this.add("proxy.custom.http_port",  0 );
    this.add("proxy.custom.no_proxies_on" ,  "localhost, 127.0.0.1" );
    this.add("proxy.custom.proxy_over_tls" ,  true );
    this.add("proxy.custom.share_proxy_settings" ,  false );
    this.add("proxy.custom.socks" ,  "" );
    this.add("proxy.custom.socks_port" , 0 );
    this.add("proxy.custom.socks_remote_dns" ,  false );
    this.add("proxy.custom.socks_version" ,  5 );
    this.add("proxy.custom.ssl" ,  "" );
    this.add("proxy.custom.ssl_port" ,  0  );
    this.add("proxy.custom.type" ,  5 );

    // Proxy preferences JonDoFox
    this.add("proxy.jondo.autoconfig_retry_interval_max" ,  300 );
    this.add("proxy.jondo.autoconfig_retry_interval_min" ,  5 );
    this.add("proxy.jondo.autoconfig_url" ,  "" );
    this.add("proxy.jondo.failover_timeout" ,  1800 );
    this.add("proxy.jondo.ftp" ,  "" , "", false,0);
    this.add("proxy.jondo.ftp_port" ,  4001 );
    this.add("proxy.jondo.http" ,  "127.0.0.1" );
    this.add("proxy.jondo.http_port",  0 );
    this.add("proxy.jondo.no_proxies_on" ,  "");
    this.add("proxy.jondo.proxy_over_tls" ,  true);
    this.add("proxy.jondo.share_proxy_settings" ,  false);
    this.add("proxy.jondo.socks" ,  "" );
    this.add("proxy.jondo.socks_port" , 0 );
    this.add("proxy.jondo.socks_remote_dns" );
    this.add("proxy.jondo.socks_version" ,  5 );
    this.add("proxy.jondo.ssl" ,  "" );
    this.add("proxy.jondo.ssl_port" ,  0 );
    this.add("proxy.jondo.type" ,  5 );


    // Proxy preferences Tor
    this.add("proxy.tor.autoconfig_retry_interval_max" ,  300);
    this.add("proxy.tor.autoconfig_retry_interval_min" ,  5 );
    this.add("proxy.tor.autoconfig_url" ,  "" );
    this.add("proxy.tor.failover_timeout" ,  1800 );
    this.add("proxy.tor.ftp" ,  "" );
    this.add("proxy.tor.ftp_port" ,  4001 );
    this.add("proxy.tor.http" ,  "127.0.0.1" );
    this.add("proxy.tor.http_port",  0 );
    this.add("proxy.tor.no_proxies_on" ,  "localhost, 127.0.0.1" );
    this.add("proxy.tor.proxy_over_tls" ,  true );
    this.add("proxy.tor.share_proxy_settings" ,  false );
    this.add("proxy.tor.socks" ,  "127.0.0.1" );
    this.add("proxy.tor.socks_port" , 9050 );
    this.add("proxy.tor.socks_remote_dns" ,  false );
    this.add("proxy.tor.socks_version" ,  5 );
    this.add("proxy.tor.ssl" ,  "" );
    this.add("proxy.tor.ssl_port" ,  0 );
    this.add("proxy.tor.type" ,  5 );
  },

  add: function(prefName, value){

      var tempArray = [];

      tempArray.push(prefName);
      tempArray.push(value);
      this.proxy_prefs.push(tempArray);
  },

  install : function(){
    for(var i = 0; i < this.proxy_prefs.length; i++){
      require("sdk/preferences/service").set("extensions.jondofox." + this.proxy_prefs[i][0]  , this.proxy_prefs[i][1] );
    }
  },

  deinstall : function(){
    for(var i = 0; i < this.proxy_prefs.length; i++){
      require("sdk/preferences/service").reset("extensions.jondofox." + this.proxy_prefs[i][0] );
    }
  },

  setProxyIfWasEnabledInDefault : function setProxyIfWasEnabledInDefault(){
    this.createDefaultBackup();
    if(require("sdk/preferences/service").get("network.proxy.type") == 5){
      this.createDefaultProxy();
      this.setProxy("default");
    }else if(require("sdk/preferences/service").get("network.proxy.type") == 0){
      this.setProxy("no");
    }
  }
}



exports.proxyService = proxyService;
