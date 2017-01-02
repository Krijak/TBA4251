var MyApp = MyApp || {};
MyApp.openSidebar = false;
MyApp.openHelp = false;

$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
    initializeFileInput();
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
        if($('#sidebar').css('display') == 'none')
        {
            $('#sidebar').show(200);
        }else{
            $( "#sidebar" ).animate({
            left: "+=230",
                }, 300, function() {
            });
        }
        MyApp.openSidebar = true;
        fadeOutDarkening();
    }else{
       $( "#sidebar" ).animate({
        left: "-230",
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

function drawSidebar(){
    sidebar = document.getElementById("sidebar");

    header = document.createElement("p");
    t = document.createTextNode("LAYERS");
    header.className= "sidebarHeader";
    header.appendChild(t);


    box = document.createElement("div");
    box.className = "sidebarBox";
    box.id = "layerBox";


    sidebar.appendChild(header);
    sidebar.appendChild(box);
    drawLayerControl();
    drawLayerControl();
    drawLayerControl();
    drawLayerControl();
    drawLayerControl();

}

function drawLayerControl(){
    box = document.getElementById("layerBox");
    layerdiv = document.createElement('div');
    layerdiv.className = "layerdiv";
    layerp = document.createElement("p");
    layerp.className = "layerp";
    t = document.createTextNode("Layer name");

    changeName = document.createElement("span");
    changeName.className = "glyphicon  glyphicon-pencil changeName"
  

    hr = document.createElement("hr");
    hr.className = "layerhr";


    layerp.appendChild(t);
    layerp.appendChild(changeName);
    layerdiv.appendChild(layerp);
    // layerdiv.appendChild(hr);
    box.appendChild(layerdiv);

}