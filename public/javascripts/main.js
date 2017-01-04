var MyApp = MyApp || {};
MyApp.openSidebar = true;
MyApp.openSidebarMenu = false;
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
            document.getElementById('headerLogo').title = "Hide sidebar";
            $( "#sidebar" ).animate({
            left: "+=254",
                }, 300, function() {
            });
            $( "#sidebarMenu" ).animate({
            left: "+=507",
                }, 300, function() {
            });
            $('#headerLogo').animate({
                left: '+=90',
                }, 300, function(){
            });
        }
        MyApp.openSidebar = true;
        fadeOutDarkening();
    }else{
        document.getElementById('headerLogo').title = "Show sidebar";
       $( "#sidebar" ).animate({
        left: "-254",
            }, 300, function() {
        });
       $( "#sidebarMenu" ).animate({
        left: "-254",
            }, 300, function() {
        });
       $('#headerLogo').animate({
                left: '+40',
                }, 300, function(){
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


function openPopup(id){
    // $("#getStartedPopup").toggle( "scale" );
    $(id).show(300);
    $("#darkening").delay(200).fadeIn();
    // $("#darkening").show(500);
    // $('#getStartedPopup').removeClass( "isClosed" ).addClass( "isOpen" );
};

function drawSidebar(){
    drawLayerControl(1);
    drawLayerControl(2);
    drawLayerControl(3);
    drawLayerControl(4);
    drawLayerControl(5);

}

function openCloseSidebarMenu(content){
    if (MyApp.openSidebarMenu){
        hideThis('#sidebarMenu');
        $('.layerdiv').css("backgroundColor", "");
        MyApp.openSidebarMenu = false;
    }else{
        $('#sidebarMenu').show(200);
        console.log($('layerdiv').children());
        MyApp.openSidebarMenu = true;
    }
}




function editLayer(item, id){
    console.log(id);
    if(!MyApp.openSidebarMenu){
        $(item).parent().parent().css("backgroundColor", "grey");
    }
    openCloseSidebarMenu();

}

function hideshow(item, layerid){
    if ($(item).hasClass( "glyphicon-eye-close" )){
        item.className = "glyphicon glyphicon-eye-open hideshowLayer layer";
        item.title = "Hide layer";
        MyApp.allLayers._layers[layerid].addTo(MyApp.map);

    }else{
        item.className = "glyphicon glyphicon-eye-close hideshowLayer layer";
        item.title = "Show layer";
        MyApp.map.removeLayer(MyApp.map._layers[layerid]);
    }

}

function drawLayerControl(layerid){
    box = document.getElementById("layerBox");
    layertr = document.createElement('tr');
    layertr.className = "layerdiv";
    layerp = document.createElement("td");
    layerp.className = "layerp";
    layerp.id = layerid + 'name';
    t = document.createTextNode("Layer name");

    td = document.createElement("td");
    edit = document.createElement("span");
    edit.className = "glyphicon  glyphicon-pencil changeName layer";
    edit.title = "Edit layer";
    edit.onclick = function(){editLayer(this, layerid + 'name')};

    td1 = document.createElement("td");
    hideshowLayer = document.createElement("span");
    hideshowLayer.className = "glyphicon glyphicon-eye-open hideshowLayer layer";
    hideshowLayer.title = "Hide layer";
    hideshowLayer.onclick = function(){hideshow(this, layerid)};

    td2 = document.createElement("td");
    goToLayer = document.createElement("span");
    goToLayer.className = "glyphicon glyphicon-search layer";
    goToLayer.title = "Go to layer";
    // hideshowLayer.onclick = function(){hideshow(this)};

    td3 = document.createElement("td");
    downloadLayer = document.createElement("span");
    downloadLayer.className = "glyphicon glyphicon-download-alt layer";
    // hideshowLayer.onclick = function(){hideshow(this)};
  

    hr = document.createElement("hr");
    hr.className = "layerhr";


    layerp.appendChild(t);
    td.appendChild(hideshowLayer);
    td1.appendChild(edit);
    td2.appendChild(goToLayer);
    td3.appendChild(downloadLayer);
    layertr.appendChild(layerp);
    layertr.appendChild(td2);
    layertr.appendChild(td);
    layertr.appendChild(td1);
    box.appendChild(layertr);


}

