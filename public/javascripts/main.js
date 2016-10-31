$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
    initializeFileInput();
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://heroku_k7jjmzwc:idaj27pbptblpb7f1nh3oiiqu9@ds139327.mlab.com:39327/heroku_k7jjmzwc');
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

function initializeFileInput(){
	    $("#input-21").fileinput({
        // previewFileType: "image",
        browseClass: "btn btn-browse",
        browseLabel: "...",
        removeLabel: "",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadLabel: "Upload",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
        showPreview: false,
        elErrorContainer: "#errorBlock",
        allowedFileExtensions: ["txt", "md", "ini", "text"],
    });
}

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