$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
});

function initializeMap(){
	var map = L.map('map', {
    	zoomControl: false,
    }).setView([63.43, 10.4], 12);
	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
	// L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('').addTo(map);
	L.control.zoom({
     	position:'topright'
	}).addTo(map);
};

function fadeOut(id){
	$(id).fadeOut(500);
};

function hideThis(id) {
	$(id).hide(300);
};

function openGetStartedPopup(){
	$("#getStartedPopup").show(300);
	$("#darkening").delay(200).fadeIn();
	// $("#darkening").show(500);
	// $('#getStartedPopup').removeClass( "isClosed" ).addClass( "isOpen" );
};