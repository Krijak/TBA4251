var MyApp = MyApp || {};
MyApp.openSidebar = true;
MyApp.openSidebarMenu = [0, 0];
MyApp.openHelp = false;
MyApp.currentStyle = null;

$( document ).ready(function() {
    console.log( "ready!" );

    initializeMap();
    initializeFileInput();
    addToMap(true);
    // orderLayers();

    $( "#layerUl" ).sortable();
    $( "#layerUl" ).disableSelection();
    var $sortableList = $("#layerUl");

    var sortEventHandler = function(event, ui){
        var idsInOrder = $sortableList.sortable("toArray");
        if (idsInOrder.length == $('ul#layerUl li').length) {
            for (var i in idsInOrder){
                MyApp.map._layers[idsInOrder[i]].bringToBack();//setZIndex(zIndex);
            }
        }
    };

    $sortableList.sortable({
        stop: sortEventHandler
    });

    // You can also set the event handler on an already existing Sortable widget this way:

    $sortableList.on("sortchange", sortEventHandler);

        // dragDrop();
        // drawSidebar();
    });

function orderLayers(){
    var $sortableList = $("#layerUl");
    var idsInOrder = $sortableList.sortable("toArray");

    for (var i in idsInOrder){
        MyApp.map._layers[idsInOrder[i]].bringToBack();//setZIndex(zIndex);
    }
}

function initializeMap(){
	MyApp.map = L.map('map', {
    	zoomControl: false,
    }).setView([63.422, 10.526], 13);//[58.96, 5.717], 13) //[63.422, 10.38], 13);
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

function updateValue(val, id) {
    document.getElementById(id).innerHTML=val; 
}

function editNavbar(){
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

    if(id == 'toolsPopup'){
        $("toolsSelect").val("0");
    }
};

function hideOrShowSidebar(){
    orderLayers();
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


function openCloseSidebarMenu(id){
    if (!MyApp.openSidebarMenu[0]){
        $('#sidebarMenu').show(200);
        MyApp.currentStyle = [MyApp.map._layers[id].options.style, id];
        MyApp.openSidebarMenu = [1, id];
    } else if (MyApp.openSidebarMenu[1] == id || id == -1) {
        hideThis('#sidebarMenu');  
        MyApp.openSidebarMenu = [0, id];
        $('.layerdiv').css("backgroundColor", "");
        document.getElementById("layernameinput").value = "";
        MyApp.map._layers[MyApp.currentStyle[1]].setStyle(MyApp.currentStyle[0]);
    }else if (MyApp.openSidebarMenu[1] != id){
        MyApp.map._layers[MyApp.currentStyle[1]].setStyle(MyApp.currentStyle[0]);

    }
}


function deleteLayer(id){
    MyApp.map.removeLayer(MyApp.map._layers[id]);
    $("#"+id+'name').parent().css('display', 'none');
    hideThis('#sidebarMenu');  
    MyApp.openSidebarMenu = [0, 0];

}

function downloadTheLayer(id){
    layer = MyApp.map._layers[id];

    var json = layer.toGeoJSON();
    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var dlAnchorElem = document.getElementById('downloadLayer');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "scene.json");
    // newWindow = window.open(dataStr);
    dlAnchorElem.click();


}


function editLayer(item, id){
    if ($('#'+ id + 'hideshow').hasClass("glyphicon-eye-close")){
        $('#'+ id + 'hideshow').removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
        MyApp.map._layers[id].setStyle(MyApp.map._layers[id].options.style);

    }

    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var turveistyle = {
        "color": color,
        "fillColor": color,
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.3, 
     };
     if (MyApp.openSidebarMenu[1] != id && MyApp.openSidebarMenu[1]!=0){
        MyApp.map._layers[MyApp.currentStyle[1]].setStyle(MyApp.currentStyle[0]);
     }
     // var idtest = "'"id"'";
    if(!MyApp.openSidebarMenu[0] || MyApp.openSidebarMenu[1] != id){
        $(item).parent().parent().css("backgroundColor", "grey");
        updateSidebarMenu(id);

        document.getElementById("layernameinput").value = MyApp.layernames[id];

        
        if (MyApp.openSidebarMenu[1] != id) {
            $('.layerdiv').css("backgroundColor", "");
            $(item).parent().parent().css("backgroundColor", "grey");
            // document.getElementById("layernameinput").value = MyApp.layernames[id];
            MyApp.currentStyle = [MyApp.map._layers[id].options.style, id];
            MyApp.map._layers[MyApp.currentStyle[1]].setStyle(MyApp.currentStyle[0]);
            MyApp.openSidebarMenu = [0, id];
            // MyApp.currentStyle = [MyApp.map._layers[id].options.style, id];

        }
    }
    openCloseSidebarMenu(id);

}

function updateSidebarMenu(id){
    // $('.colorpicker-saturation').onclick = layerChanges(false);

    if (MyApp.layertypes[id] == 'polyline') {
        document.getElementById('filldiv').style.display = 'none';
    }else{
        document.getElementById('filldiv').style.display = 'block';
    }

    $('#cpfill').colorpicker({format: 'hex'});
    $('#cpstroke').colorpicker({format: 'hex'});

    $('#cpfill').colorpicker('setValue', MyApp.map._layers[id].options.style.fillColor);

    document.getElementById('opacityrange').value= MyApp.map._layers[id].options.style.fillOpacity;
    document.getElementById('opacity').innerHTML= MyApp.map._layers[id].options.style.fillOpacity;

    $('#cpstroke').colorpicker('setValue', MyApp.map._layers[id].options.style.color);

    document.getElementById('strokeweightrange').value= MyApp.map._layers[id].options.style.weight;
    document.getElementById('strokeweight').innerHTML= MyApp.map._layers[id].options.style.weight;

    document.getElementById('strokeopacityrange').value= MyApp.map._layers[id].options.style.opacity;
    document.getElementById('strokeopacity').innerHTML= MyApp.map._layers[id].options.style.opacity;

    document.getElementById('deleteLayer').onclick = function(){deleteLayer(id)};

    name = MyApp.layernames[id].split(' ').join('_');

    layer = MyApp.map._layers[id];
    var json = layer.toGeoJSON();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var dlAnchorElem = document.getElementById('downloadLayer');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", name + ".geojson");

}


function layerChanges(save){
    id = MyApp.openSidebarMenu[1];

    if ($('#'+ id + 'hideshow').hasClass("glyphicon-eye-close")){
        $('#'+ id + 'hideshow').removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
        MyApp.map._layers[id].setStyle(MyApp.map._layers[id].options.style);

    }

    fillColor = document.getElementById('cpfillinput').value;
    fillOpacity = document.getElementById('opacityrange').value;
    color = document.getElementById('cpstrokeinput').value;
    weight = document.getElementById('strokeweightrange').value;
    opacity = document.getElementById('strokeopacityrange').value;

    var style = {
        "fillColor": fillColor,
        "fillOpacity": fillOpacity, 
        "color": color,
        "weight": weight,
        "opacity": opacity,
     };

    MyApp.map._layers[id].setStyle(style);
    
    if (save) {
        var name = document.getElementById("layernameinput").value;
        if (name != '' && !(/^ *$/.test(name))){
            console.log((/^ *$/.test(name)));
            document.getElementById(id + 'name').innerHTML = name;
            MyApp.layernames[id] = name;
            // $('#layernameinput').attr("placeholder", MyApp.layernames[id]);
            // console.log(MyApp.layernames);
        }
        MyApp.map._layers[id].options.style = style;
        MyApp.currentStyle[0] = style;
        openCloseSidebarMenu(-1);
    }
}


function hideshow(item, layerid){
    var hide = {opacity: 0, fillOpacity: 0,};

    if ($(item).hasClass( "glyphicon-eye-close" )){
        item.className = "glyphicon glyphicon-eye-open hideshowLayer layer";
        item.title = "Hide layer";
        MyApp.map._layers[layerid].setStyle(MyApp.map._layers[layerid].options.style);
        // MyApp.map._layers[layerid].resetStyle();

        // MyApp.allLayers._layers[layerid].addTo(MyApp.map);

    }else{
        item.className = "glyphicon glyphicon-eye-close hideshowLayer layer";
        item.title = "Show layer";
        MyApp.map._layers[layerid].setStyle(hide);
        // MyApp.map.removeLayer(MyApp.map._layers[layerid]);
    }

}

function panToLayer(layerid){
    bounds = MyApp.map._layers[layerid].getBounds();
    MyApp.map.fitBounds(bounds);

}

function drawLayerControl(layerid, name){


    ul = document.getElementById('layerUl');
    li = document.createElement('li');
    li.className = 'ui-state-default';
    li.id = layerid;

    box = document.createElement('table');
    box.id = 'layerBox';
    layertr = document.createElement('tr');
    layertr.className = "layerdiv no-swipe group handle instant ";
    layerp = document.createElement("td");
    layerp.className = "layerp";
    layerp.id = layerid + 'name';
    t = document.createTextNode(name);

    td = document.createElement("td");
    edit = document.createElement("span");
    edit.className = "glyphicon  glyphicon-pencil changeName layer";
    edit.title = "Edit layer";
    edit.onclick = function(){editLayer(this, layerid)};

    td1 = document.createElement("td");
    hideshowLayer = document.createElement("span");
    hideshowLayer.id = layerid + "hideshow";
    hideshowLayer.className = "glyphicon glyphicon-eye-open hideshowLayer layer";
    hideshowLayer.title = "Hide layer";
    hideshowLayer.onclick = function(){hideshow(this, layerid)};

    td2 = document.createElement("td");
    goToLayer = document.createElement("span");
    goToLayer.className = "glyphicon glyphicon-search layer";
    goToLayer.title = "Go to layer";
    goToLayer.onclick = function(){panToLayer(layerid)};

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
    li.appendChild(box);
    ul.insertBefore(li, ul.childNodes[0]);

    selectTool();

    // list.insertBefore(newItem, list.childNodes[0])

    // MyApp.map._layers[layerid].bringToBack();


}

function drawDropdownTool(dropdownId, name){

    dropdown = document.getElementById(dropdownId);

    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    optionSelected = document.createElement('option');
    optionSelected.disabled = true;
    optionSelected.selected = true;
    optionSelected.innerHTML = name;
    optionSelected.value = 0;
    dropdown.appendChild(optionSelected);

    for (var object in MyApp.layernames){
        dropdown.options.add( new Option(MyApp.layernames[object],object) );
    }

}

function selectTool(){
        drawDropdownTool('bufferSelect', 'Select layer');
        drawDropdownTool('merge1select', 'Select first layer');
        drawDropdownTool('merge2select', 'Select second layer');
        drawDropdownTool('intersect1select', 'Select first layer');
        drawDropdownTool('intersect2select', 'Select second layer');
        drawDropdownTool('difference1select', 'Select first layer');
        drawDropdownTool('difference2select', 'Select second layer');
    $( "#allToolsDiv" ).children().css( "display", "none" );
    if($( "#toolsSelect option:selected" ).val() == 'buffer'){
        document.getElementById('bufferDiv').style.display = 'block';
    } else if($( "#toolsSelect option:selected" ).val() == 'merge'){
        document.getElementById('mergeDiv').style.display = 'block';
    }else if($( "#toolsSelect option:selected" ).val() == 'intersect'){
        document.getElementById('intersectDiv').style.display = 'block';
    }else if($( "#toolsSelect option:selected" ).val() == 'difference'){
        document.getElementById('differenceDiv').style.display = 'block';
    }


}



