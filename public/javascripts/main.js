var MyApp = MyApp || {};
MyApp.openSidebar = false;
MyApp.openHelp = false;

$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
    initializeFileInput();
    addToMap();
});

function initializeMap(){
	MyApp.map = L.map('map', {
    	zoomControl: false,
    }).setView([63.422, 10.38], 13);
	L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(MyApp.map);
	// L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
	// L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
	// L.tileLayer('').addTo(map);
	L.control.zoom({
     	position:'topright'
	}).addTo(MyApp.map);
    // console.log(MyApp);
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
        allowedFileExtensions: ["geojson"],
    });
}

function fadeOutDarkening(){
	$("#darkening").fadeOut(500);
    if (MyApp.openHelp){
        hideOrShowHelp(true);
    }
};

function hideThis(id) {
	$(id).hide(300);
};

function hideOrShowSidebar(){
    if (!MyApp.openSidebar){
        $( "#sidebar" ).animate({
        left: "-240",
            }, 300, function() {
        });
        MyApp.openSidebar = true;
        fadeOut('#darkening');
    }else{
       $( "#sidebar" ).animate({
        left: "+=240",
            }, 300, function() {
        });
        MyApp.openSidebar = false; 
    }
};

function hideOrShowHelp(cameFromLogo){
    if (!cameFromLogo){
        $("#getStartedPopup").hide(500);
    }
        if (MyApp.openHelp){
        $( "#help" ).animate({
        top: "-400",
            }, 300, function() {
        });
        MyApp.openHelp = false;
        fadeOutDarkening();
        
    }else{
       $( "#help" ).animate({
        top: "+=400",
            }, 300, function() {
        });
        MyApp.openHelp = true; 
        $("#darkening").delay(200).fadeIn();
        
    }

}

function openGetStartedPopup(){
    // $("#getStartedPopup").toggle( "scale" );
	$("#getStartedPopup").show(300);
	$("#darkening").delay(200).fadeIn();
	// $("#darkening").show(500);
	// $('#getStartedPopup').removeClass( "isClosed" ).addClass( "isOpen" );
};