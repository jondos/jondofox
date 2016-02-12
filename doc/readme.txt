0) Installation des Mozilla SDKs

  a) Installation npm / jpm

	die Anleitung folgt der offiziellen Mozilla Docu unter
	https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation	

	Mozilla verwendet seit FF38 als Build-/Runtime Umgebung jpm
	vgl. auch: https://wiki.mozilla.org/Jetpack/FAQ	 

	jpm ist eine Node-basierte Anwendung, d.h. zuvor ist npm, 
	der Package-Manager von node.js zu installieren

	- Download und Installation von npm, von https://nodejs.org/en/
	- nachdem npm läuft, Installation jpm per npm
		> npm install jpm --global 

	Weitere (umfangreiche) Details zu jpm können folgendem Tutorial entnommen werden:
	https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_Started_%28jpm%29  

   b) Erster Start der jondofox Anwendung
	
	- in den folder von jondofox wechseln, ggf. per aktuellen Stand holen
		> git pull

	- Start der Anwendung per
		> jpm run

	- falls mehrere FF-Installationen vorhanden (Nightly, Beta, Current etc.),
	ist zusätzlich die Angabe des FF binries nötig, welches verwendet werden soll.
	Dies erfolgt über den Parameter -b (binary), also zB
		> jpm - run -b /home/ffdev/bin/firefox45/firefox

   c) Addon-Settings von jondofox (vgl. Task #1168)
	
	Die Seite zum Setzen der jondofx Preferences ist auf zwei Wegen erreichbar.

	I) Standard Weg

	Zunächst wird der 'Standard-Weg' aufgezeigt, der immer / wie früher geht.

	- Adressleiste, Eingabe von
		adbout:addons
	- hier muss mindestens 'JonDoFox-Lite 0.0.1' (o.ä.) auftauchen
	- auf 'Preferences' (od. 'Einstellungen') klicken
	- es erscheint die spezifischen Settings-Seite von jondofox

	II) Aufruf anhand der Resource-URL

	Zusätzlich steht (zum derzeitgen Zeitpunkt) der auf der Resource-ID basierende
	Aufruf zur Verfügung. Der Aufruf mit der Resource-URL als Adresse sollte 
	(feb 2016) überall funktionieren.

	resource://jid1-gf76y9gfw7tzgb-at-jondofoxlite/data/options.html	
	
	Die UI ist flexibel änderbar, die Seite unterliegt komplett eigener Kontrolle.
	Die Persistenz dahinter kann ggn. preferences Arbeiten od. auch auf eigene Storage 
	abgebildet werden. Die Logik ist selbst zu erstellen.

		
