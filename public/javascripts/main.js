var MyApp = MyApp || {};
MyApp.openSidebar = true;
MyApp.openHelp = false;

$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
    initializeFileInput();
    addToMap(true);
    // drawSidebar();
});

function initializeMap(){
	MyApp.map = L.map('map', {
    	zoomControl: false,
    }).setView([58.96, 5.717], 13) //[63.422, 10.38], 13);
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

function editNavbar(){
    console.log("hei");
    document.getElementById('getStarted').style.display = 'none';
    document.getElementById('theNavbar').style.width = '254px';
    document.getElementById('theNavbar').style.boxShadow = 'none';
    document.getElementById('theNavbar').style.background= 'rgba(253, 252, 252, 0)';
  //   $( "#theNavbar" ).animate({
  //   width: "254"
  // }, 300, function() {
  //   // Animation complete.
  // });

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

    // header = document.createElement("p");
    // t = document.createTextNode("LAYERS");
    // header.className= "sidebarHeader";
    // header.appendChild(t);


    // box = document.createElement("table");
    // box.style.width = "100%";
    // box.className = "sidebarBox";
    // box.id = "layerBox";

    // legend = document.createElement('table');
    // legend.style.width = '100%';


    // sidebar.appendChild(header);
    // sidebar.appendChild(box);
    drawLayerControl(1);
    drawLayerControl(2);
    drawLayerControl(3);
    drawLayerControl(4);
    drawLayerControl(5);

}




function editLayerName(id){
    console.log(id);
}

function hideshow(item){
    if ($(item).hasClass( "glyphicon-eye-close" )){
        item.className = "glyphicon glyphicon-eye-open hideshowLayer layer";      
    }else{
        item.className = "glyphicon glyphicon-eye-close hideshowLayer layer";
    }

}

function drawLayerControl(layerid){
    box = document.getElementById("layerBox");
    layerdiv = document.createElement('tr');
    // layerdiv.style.width = "100%";
    layerdiv.className = "layerdiv";
    layerp = document.createElement("td");
    layerp.className = "layerp";
    layerp.id = layerid + 'name';
    t = document.createTextNode("Layer name");

    td = document.createElement("td");
    changeName = document.createElement("span");
    changeName.className = "glyphicon  glyphicon-pencil changeName layer";
    changeName.onclick = function(){editLayerName(layerid + 'name')};

    td1 = document.createElement("td");
    hideshowLayer = document.createElement("span");
    hideshowLayer.className = "glyphicon glyphicon-eye-open hideshowLayer layer";
    hideshowLayer.onclick = function(){hideshow(this)};

    td2 = document.createElement("td");
    goToLayer = document.createElement("span");
    goToLayer.className = "glyphicon glyphicon-search layer";
    // hideshowLayer.onclick = function(){hideshow(this)};

    td3 = document.createElement("td");
    downloadLayer = document.createElement("span");
    downloadLayer.className = "glyphicon glyphicon-download-alt layer";
    // hideshowLayer.onclick = function(){hideshow(this)};
  

    hr = document.createElement("hr");
    hr.className = "layerhr";

    // tr = document.createElement("tr");

    layerp.appendChild(t);
    td.appendChild(hideshowLayer);
    td1.appendChild(changeName);
    td2.appendChild(goToLayer);
    td3.appendChild(downloadLayer);
    layerdiv.appendChild(layerp);
    // layerdiv.appendChild(td3);
    layerdiv.appendChild(td2);
    layerdiv.appendChild(td);
    layerdiv.appendChild(td1);

    box.appendChild(layerdiv);

    // layerdiv.appendChild(hr);
    // box.appendChild(layerdiv);

}

