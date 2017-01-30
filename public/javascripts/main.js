var MyApp = MyApp || {};
MyApp.openSidebar = true;
MyApp.openSidebarMenu = [0, 0];
MyApp.openHelp = false;
MyApp.currentStyle = null;

$( document ).ready(function() {
    console.log( "ready!" );

    // initializes the map and adds all the initial layers to it.
    initializeMap();
    addToMap(true);
    // initializeFileInput();

    //defines the layer control as a "sortable list", jQueryUI library
    $( "#layerUl" ).sortable();
    $( "#layerUl" ).disableSelection();
    var $sortableList = $("#layerUl");

    //orders the layers
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

    // defines what happens when the sortable list is rearranged
    $sortableList.on("sortchange", sortEventHandler);

    // defines what happens when the color picker changes color
    $('.colorpicker-component').colorpicker().on('changeColor',
            function(ev) {
            if (MyApp.openSidebarMenu[0]){
                layerChanges(false);
            }
        });

    });


$(function(){
  $( "#layerUl" ).bind( "taphold", dragAndDropTouch );
 
  function dragAndDropTouch( event ){
    console.log('tapped');
    // $().addClass( "taphold" );
  }
});

function loadBtn(item){
    var $this = $(item);
        $this.button('loading');
        setTimeout(function() {
           $this.button('reset');
       }, 8000);

}

// what happens when the order in the sortable list is rearranged
function orderLayers(){
    var $sortableList = $("#layerUl");
    var idsInOrder = $sortableList.sortable("toArray");

    for (var i in idsInOrder){
        MyApp.map._layers[idsInOrder[i]].bringToBack();//setZIndex(zIndex);
    }
}

// this is not in use
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

// this is not in use
function editNavbar(){
    document.getElementById('getStarted').style.display = 'none';
    document.getElementById('theNavbar').style.width = '254px';
    document.getElementById('theNavbar').style.boxShadow = 'none';
    document.getElementById('theNavbar').style.background= 'rgba(253, 252, 252, 0)';
}

function openPopup(id){
    $(id).show(300);
    $("#darkening").delay(200).fadeIn();
};

// when popups close
function fadeOutDarkening(){
	$("#darkening").fadeOut(500);
    if (MyApp.openHelp){
        hideOrShowHelp(true);
    }
};

//close
function hideThis(id) {
	$(id).hide(300);
    if(id == '#toolsPopup'){
        $(".error").css("display","none");
    }
};

// hide or show side bar menu
function hideOrShowSidebar(){
    if (!MyApp.openSidebar){
        if($('#sidebar').css('display') == 'none')
        {
            $('#sidebar').show(200);
        }else{
            document.getElementById('headerLogo').title = "Hide sidebar";
            $( "#sidebar" ).animate({
            left: "+=500",
                }, 300, function() {
            });
            // $('#sidebarMenu').show(200);
            if($(window).width()< 480){
               $( "#sidebarMenu" ).animate({
                left: "0",
                    }, 300, function() {
                });
           }else{
             $( "#sidebarMenu" ).animate({
                left: "254",
                    }, 300, function() {
                });

           }
            $('#headerLogo').animate({
                left: '50%',
                }, 300, function(){
            });
        }
        MyApp.openSidebar = true;
        fadeOutDarkening();
    }else{
        document.getElementById('headerLogo').title = "Show sidebar";
       $( "#sidebar" ).animate({
        left: "-500",
            }, 300, function() {
        });
       // $('#sidebarMenu').hide(300);
       if($(window).width()< 480){
           $( "#sidebarMenu" ).animate({
            left: "-102vw",
                }, 300, function() {
            });
       }else{
         $( "#sidebarMenu" ).animate({
            left: "-255",
                }, 300, function() {
            });

       }

       $('#headerLogo').animate({
                left: '+40',
                }, 300, function(){
            });
        MyApp.openSidebar = false; 
    }
};

//This is not in use
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
    delete MyApp.layernames[id];
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


// what happens when the edit layer button is pressed in the sidebar menu
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

//set values to the sidebar menu
function updateSidebarMenu(id){

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


//deals with layer changes (previews layers or save changes)
function layerChanges(save,colors){
    id = MyApp.openSidebarMenu[1];
    fillColor = document.getElementById('cpfillinput').value;
    color = document.getElementById('cpstrokeinput').value;
    fillOpacity = document.getElementById('opacityrange').value;
    weight = document.getElementById('strokeweightrange').value;
    opacity = document.getElementById('strokeopacityrange').value;

    var style = {
        "fillColor": fillColor,
        "fillOpacity": fillOpacity, 
        "color": color,
        "weight": weight,
        "opacity": opacity,
     };

     var styleNotColor = {
        "fillOpacity": fillOpacity, 
        "weight": weight,
        "opacity": opacity,
     };

     MyApp.map._layers[id].setStyle(styleNotColor);

    colors = colors || [color, fillColor];

    var count = 0;
    var keepGoing = true;

    for (var i in MyApp.layernames){
        c = MyApp.map._layers[i].options.style.color;
        fc = MyApp.map._layers[i].options.style.fillColor;
        count = count + 1;
        if (((colors[0] == c)&&(MyApp.layertypes[id] == 'polyline')) || ((colors[1] == fc)&& (MyApp.layertypes[id] != 'polyline'))) {
            keepGoing = false;
        }
    }
    
    if (keepGoing){
        if (id != undefined) {
            if ($('#'+ id + 'hideshow').hasClass("glyphicon-eye-close")){
                $('#'+ id + 'hideshow').removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
                MyApp.map._layers[id].setStyle(MyApp.map._layers[id].options.style);
            } MyApp.map._layers[id].setStyle(style);
        }
    }

    if (save) {
        var name = document.getElementById("layernameinput").value;
        if (name != '' && !(/^ *$/.test(name))){
            document.getElementById(id + 'name').innerHTML = name;
            MyApp.layernames[id] = name;
        }
        MyApp.map._layers[id].options.style = style;
        MyApp.currentStyle[0] = style;
        openCloseSidebarMenu(-1);
    } 
}

// hides or shows layer when the button is pressed in the sidebar
function hideshow(item, layerid){
    var hide = {opacity: 0, fillOpacity: 0,};

    if ($(item).hasClass( "glyphicon-eye-close" )){
        item.className = "glyphicon hideshowLayer layer glyphicon-eye-open";
        item.title = "Hide layer";
        MyApp.map._layers[layerid].setStyle(MyApp.map._layers[layerid].options.style);

    }else{
        item.className = "glyphicon glyphicon-eye-close hideshowLayer layer";
        item.title = "Show layer";
        MyApp.map._layers[layerid].setStyle(hide);
    }

}

//pans to layer when the button is pressed in the sidebar
function panToLayer(layerid){
    bounds = MyApp.map._layers[layerid].getBounds();
    MyApp.map.fitBounds(bounds);

}

//add layers to the layercontrol in the sidebar
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
    // layerp.onclick = function(){editLayer(document.getElementById(layerid + 'edit'), layerid)}; 


    td0 = document.createElement("td");
    edit = document.createElement("span");
    edit.className = "glyphicon  glyphicon-pencil changeName layer";
    edit.title = "Edit layer";
    edit.id = layerid + 'edit';
    edit.onclick = function(){editLayer(document.getElementById(layerid + 'edit'), layerid)};

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
    td2.onclick = function(){panToLayer(layerid)};

    td3 = document.createElement("td");
    downloadLayer = document.createElement("span");
    downloadLayer.className = "glyphicon glyphicon-download-alt layer";
    // hideshowLayer.onclick = function(){hideshow(this)};
  

    hr = document.createElement("hr");
    hr.className = "layerhr";


    layerp.appendChild(t);
    td0.appendChild(edit);
    td1.appendChild(hideshowLayer);
    td2.appendChild(goToLayer);
    td3.appendChild(downloadLayer);
    layertr.appendChild(layerp);
    layertr.appendChild(td2);
    layertr.appendChild(td1);
    layertr.appendChild(td0);
    box.appendChild(layertr);
    li.appendChild(box);
    ul.insertBefore(li, ul.childNodes[0]);

    selectTool();

}

//desides which spatial tool to be shown in the tools-popup
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

//draws the tools-popup
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


var helpPopup = {
    start: {
        name: "TBA4251",
        imgPath: "../../images/logo_orange_shdw.png",
        txt: "This is a vector based web", 
        txt1: "developed as a project in the course Programming in Geomatics at NTNU. For more information, visit the",
        link: " GitHub repository."
    },
    spatialOps:{
        name: "HOW TO DO SPATIAL OPERATIONS ON LAYERS",
        txt: "To do spatial operations like buffer or intersect, press the Tools button, and choose a spatial operation in the dropwdown menu. Then, choose layers you want to do the operations on.",
        gifPath: "../images/help/buffer.gif"
    },
    changeName:{
        name: "CHANGE COLOR AND LAYER NAME",
        txt: "To change name and color, press the pen icon in the layer control, and then apply wanted styling and name. If you want to keep the changes, remember to press the 'Save changes' button!",
        gifPath: "../images/help/changeNameColor.gif"
    },
    deleteLayer:{
        name: "HOW TO DELETE OR DOWNLOAD A LAYER",
        txt: "To delete a layer, press the pen in the layer control and then the trash can at the bottom of the menu. If you want to downlaod a layer as a geoJSON file, press the download icon at the bottom of the menu.",
        gifPath: "../images/help/deleteLayer.gif"
    },
    hideShowLayer:{
        name: "HOW TO HIDE AND SHOW A LAYER",
        txt: "To hide and show a layer, press the eye icon in the layer control.",
        gifPath: "../images/help/hideShowLayer.gif"
    },
    orderLayer:{
        name: "HOW TO ORDER LAYERS",
        txt: "To order layers, simply drag the layers in wantet order.",
        gifPath: "../images/help/orderLayer.gif"
    },
    panToLayer:{
        name: "HOW TO PAN AND ZOOM TO LAYER",
        txt: "To pan and zoom to a layer, press the magnifying glass icon in the layer control.",
        gifPath: "../images/help/panToLayer.gif"
    },
    previewMap:{
        name: "HOW TO PREVIEW MAP",
        txt: "To preview the map, simply press the logo. To get the sidebar back, press the logo again.",
        gifPath: "../../images/logo_orange_shdw.png"
    }
}


function drawCloseThis(){
    closeThis = document.createElement("a");
    closeThis.className = "closeThis";
    span = document.createElement("span");
    span.style.paddingLeft = "10px";
    span.className = "glyphicon glyphicon-remove";
    closeThis.appendChild(span);
    closeThis.addEventListener("click", function(){
      hideThis("#aboutPopup");
        fadeOutDarkening();
    });

    return closeThis;
}


function drawHelp(state){
    var popup = document.getElementById("aboutPopup");
    while (popup.firstChild) {
        popup.removeChild(popup.firstChild);
    }

        popup.appendChild(drawCloseThis());

    if(state == helpPopup.start){
 
        containerDiv = document.createElement("div");
        containerDiv.style.width = "100%";
        containerDiv.overflow = "hidden";

        div1 = document.createElement("div");
        div1.style.width = "30%";
        div1.style.float = "left";
        div1.style.marginRight = "20px";

        div2 = document.createElement("div");

        img = document.createElement("img");
        img.src = state.imgPath;
        img.id = "logoHelp";
        img.className = "img-responsive";

        pName = document.createElement("p");
        pName.className = "text";
        pName.style.fontSize = "smaller";
        pName.style.fontWeight = "bold";
        pNameTxt = document.createTextNode(state.name);
        pName.appendChild(pNameTxt);

        pTxt = document.createElement("p");
        pTxt.className = "text";
        pTxt.style.fontSize = "smaller";
        pTxtTxt = document.createTextNode(state.txt);
        pTxtTxt2 = document.createTextNode(state.txt1);
        pNameB = document.createElement("b");
        pNameBold = document.createTextNode(" Geographic Information System ");
        pNameB.appendChild(pNameBold);
        pNameLink = document.createElement("a");
        pNameLinktxt = document.createTextNode(state.link);
        pNameLink.appendChild(pNameLinktxt);
        pNameLink.href = "https://github.com/Krijak/TBA4251";
        pTxt.appendChild(pTxtTxt);
        pTxt.appendChild(pNameB);
        pTxt.appendChild(pTxtTxt2);
        pTxt.appendChild(pNameLink);

        hr = document.createElement("hr");
        hr.style.borderColor = 'grey';
        hr.style.marginTop= '20px';

        pHelp = document.createElement("p");
        pHelp.className = "text";
        pHelpTxt = document.createTextNode("HOW DO I USE IT?")
        pHelp.appendChild(pHelpTxt);
        pHelp.style.fontWeight = 'bold';
        pHelp.style.marginBottom = "15px";
        pHelp.style.marginTop = '50px';

        helpDiv = document.createElement("div");

        spatialOps = document.createElement('p');
        spatialOps.className = "text helpTxt";
        spatialOps.style.fontSize = "smaller";
        spatialOpsTxt = document.createTextNode("How to do spatial operations on layers");
        spatialOps.appendChild(spatialOpsTxt);
        spatialOps.addEventListener("click", function(){
          drawHelp(helpPopup.spatialOps);
        });

        changeNameColor = document.createElement('p');
        changeNameColor.className = "text helpTxt";
        changeNameColor.style.fontSize = "smaller";
        changeNameColorTxt = document.createTextNode("How to change color and layer name");
        changeNameColor.appendChild(changeNameColorTxt);
        changeNameColor.addEventListener("click", function(){
          drawHelp(helpPopup.changeName);
        });

        deleteLayer = document.createElement('p');
        deleteLayer.className = "text helpTxt";
        deleteLayer.style.fontSize = "smaller";
        deleteLayerTxt = document.createTextNode("How to delete or download a layer");
        deleteLayer.appendChild(deleteLayerTxt);
        deleteLayer.addEventListener("click", function(){
          drawHelp(helpPopup.deleteLayer);
        });


        hideShowLayer = document.createElement('p');
        hideShowLayer.className = "text helpTxt";
        hideShowLayer.style.fontSize = "smaller";
        hideShowLayerTxt = document.createTextNode("How to hide and show a layer");
        hideShowLayer.appendChild(hideShowLayerTxt);
        hideShowLayer.addEventListener("click", function(){
          drawHelp(helpPopup.hideShowLayer);
        });


        orderLayer = document.createElement('p');
        orderLayer.className = "text helpTxt";
        orderLayer.style.fontSize = "smaller";
        orderLayerTxt = document.createTextNode("How to order layers");
        orderLayer.appendChild(orderLayerTxt);
        orderLayer.addEventListener("click", function(){
          drawHelp(helpPopup.orderLayer);
        });


        panToLayer = document.createElement('p');
        panToLayer.className = "text helpTxt";
        panToLayer.style.fontSize = "smaller";
        panToLayerTxt = document.createTextNode("How to pan to layer");
        panToLayer.appendChild(panToLayerTxt);
        panToLayer.addEventListener("click", function(){
          drawHelp(helpPopup.panToLayer);
        });

        previewMap = document.createElement('p');
        previewMap.className = "text helpTxt";
        previewMap.style.fontSize = "smaller";
        previewMapTxt = document.createTextNode("How to preview map");
        previewMap.appendChild(previewMapTxt);
        previewMap.addEventListener("click", function(){
          drawHelp(helpPopup.previewMap);
        });

        helpDiv.appendChild(spatialOps);
        helpDiv.appendChild(changeNameColor);
        helpDiv.appendChild(deleteLayer);
        helpDiv.appendChild(hideShowLayer);
        helpDiv.appendChild(orderLayer);
        helpDiv.appendChild(panToLayer);
        helpDiv.appendChild(previewMap);



        div1.appendChild(img);
        div1.appendChild(pName);
        div2.appendChild(pTxt);
        containerDiv.appendChild(div1);
        containerDiv.appendChild(div2);
        // containerDiv.appendChild(hr);
        containerDiv.appendChild(pHelp);
        containerDiv.appendChild(helpDiv);


        popup.appendChild(containerDiv);



    // }else if (state == helpPopup.spatialOps){

    }else{
        back = document.createElement('span');
        back.className = "glyphicon glyphicon-chevron-left text helpBack";
        back.title = "Back to help";
        back.addEventListener("click", function(){
          drawHelp(helpPopup.start);
        });


        header = document.createElement("p");
        header.className = "helpHeader";
        headerTxt = document.createTextNode(state.name);
        header.appendChild(headerTxt);

        txt = document.createElement("p");
        txt.className = 'text';
        txt.style.fontSize = "smaller";
        txtTxt = document.createTextNode(state.txt);
        txt.appendChild(txtTxt);

        gif = document.createElement("img");
        gif.className = "helpGif";
        gif.src = state.gifPath;

        if(state == helpPopup.previewMap){
            gif.style.width = "50px";
            gif.style.position = "relative";
            gif.style.left = "50%";
            gif.style.marginLeft = "-25px";
        }

        popup.appendChild(back);
        popup.appendChild(header);
        popup.appendChild(txt);
        popup.appendChild(gif);

    }
}

