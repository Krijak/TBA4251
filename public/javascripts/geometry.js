MyApp.layernames = {};
MyApp.layertypes = {};
MyApp.layerResult = {};
MyApp.result;

// Initializes Map at startup. Adds a map to a map-div.
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

// Adds the layers to the map at start up
function addToMap(isDefault){

    MyApp.allLayers = new L.FeatureGroup();

    var color1 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var color2 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var color3 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);


    var style1 = {
        "color": color1,
        "fillColor": color1,
        "weight": 1,
        "opacity": 0.8,
        "fillOpacity": 0.3, 
     };

    var style2 = {
        "color": color2,
        "fillColor": color2,
        "weight": 2,
        "opacity": 1,
        "fillOpacity": 0.8, 
     };

    var style3 = {
        "color": color3,
        "fillColor": color3,
        "weight": 2,
        "opacity": 1,
        "fillOpacity": 1, 
     };




    var arealbruk = new L.GeoJSON.AJAX("./data/Trondheim/arealbruk.geojson", {style: style1 });
    arealbruk.addTo(MyApp.allLayers);
    
    var veg = new L.GeoJSON.AJAX("./data/Trondheim/Vei_buffer0.1.geojson", {style: style3});       
    veg.addTo(MyApp.allLayers);

    var vann = new L.GeoJSON.AJAX("./data/Trondheim/vann.geojson", {style: style2});       
    vann.addTo(MyApp.allLayers);
    
    MyApp.layernames[arealbruk._leaflet_id] = 'Arealbruk';
    MyApp.layertypes[arealbruk._leaflet_id] = 'polygon';

    MyApp.layernames[vann._leaflet_id] = 'Vann';
    MyApp.layertypes[vann._leaflet_id] = 'polygon';

    MyApp.layernames[veg._leaflet_id] = 'Vei';
    MyApp.layertypes[veg._leaflet_id] = 'polyline';


    //adds all initial layers to the map
    $.when($.ajax(MyApp.allLayers.addTo(MyApp.map))).then(function () {
    });
 
    // Adds every layer in MyApp.allLayers to the layer control in the sidebar menu
    for (var object in MyApp.allLayers._layers){
        name = MyApp.layernames[object];
        drawLayerControl(object, name);
    }

}

// Cancels the buffer computation
function cancelBuffer(){
    MyApp.bufferAjax.abort();
}

// Computes the buffer
function computeBuffer(){
    var id = document.getElementById('bufferSelect').value;
    var bufferDist = document.getElementById('bufferInput').value;

    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var mystyle = {
        "color": color,
        "fillColor": color,
        "weight": 1,
        "opacity": 0.8,
        "fillOpacity": 0.7, 
     };

     //Checks whether the right amount of input is commited
    if (id != 0 && bufferDist > 0) {


        var $button = $('#createBufferBtn');
        $button.button('loading');
        $("#createBufferBtn").toggleClass('spatialOpBtn createBufferBtnLoad');
        $( "#calculatingBufferDiv" ).css( "display", "block" );
        $( "#cancelBufferDiv" ).css( "display", "block" );
        $('#createBufferBtn').removeClass('btn');

        bufferDist = bufferDist/1000;

        //The input layer may consist of several layers
        var merged = makeOneLayer(id);

        // counts how big the layer is
        var key, count = 0;
            for(key in merged.geometry.coordinates) {
              if(merged.geometry.coordinates.hasOwnProperty(key)) {
                count++;
            }
        }

        //Display a message to the user if the layer is considered a big layer
        if(count>500){
            var obs = document.getElementById('obsBuffer');
            if($('#errorBuffer:visible').length != 0){
                error.style.display = 'none';
            }
            obs.style.display = 'block';
            obs.innerHTML = 'This layer is very big, so calculating the bufferzone can take a while. <br> You may continue with your work while waiting';

        }

        //We have to do the buffer computing at the server side because of the amount of memory required
        // theLayer is the JSON-object that contians all the data we need to send to the sever side for
        // the buffer computation to be done.
        var theLayer = JSON.stringify({'layer': merged, 'dist': bufferDist});

        // defines an ajax request. If successfull, the bufferzone is added to the map. If error, a message
        // is sent to the user
        MyApp.bufferAjax = $.ajax({
            url:"/api/buffer",
            type:"POST",
            data: theLayer,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(data){
                    if(obs != undefined){
                        obs.style.display = 'none';
                    }
                    addToMapAndLayercontrol(id, data, '_buffer' + bufferDist*1000);
                    $button.button('reset');
                    $( "#calculatingBufferDiv" ).css( "display", "none" );
                    $("#createBufferBtn").toggleClass('createBufferBtnLoad spatialOpBtn');
                    $('#createBufferBtn').addClass('btn');
                    $( "#cancelBufferDiv" ).css( "display", "none" );
              },
             error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus + ' ' + errorThrown);
                $button.button('reset');
                obs.style.display = 'none';
                $( "#calculatingBufferDiv" ).css( "display", "none" );
                $("#createBufferBtn").toggleClass('createBufferBtnLoad spatialOpBtn');
                $('#createBufferBtn').addClass('btn');
                $( "#cancelBufferDiv" ).css( "display", "none" );
             }
        });

    }else{
        var error = document.getElementById('errorBuffer');
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You must select a layer';
        console.log("You must select a layer");
    }
}


function computeMerge(){
    var layer1id = document.getElementById('merge1select').value;
    var layer2id = document.getElementById('merge2select').value;
    var error = document.getElementById('errorUnite');

    if (layer1id != 0 && layer2id != 0) {
         if (MyApp.layertypes[layer1id] == 'polyline' || MyApp.layertypes[layer2id] == 'polyline') {
            console.log('not equal polygon')
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Both layers must be polygons';
        }else{
            layer1 = makeOneLayer(layer1id);
            layer2 = makeOneLayer(layer2id);
            merged = turf.union(layer1, layer2);
            var name = '_union_' + MyApp.layernames[layer2id];   
            addToMapAndLayercontrol(layer1id, merged, name);
        }
    }else{
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You have to select two polygon layers';
        console.log('you have to select two polygon layers');
    }
}

function computeIntersect(){
    var layer1id = document.getElementById('intersect1select').value;
    var layer2id = document.getElementById('intersect2select').value;
    var error = document.getElementById('errorIntersect');

    if (layer1id != 0 && layer2id != 0) {
        if (MyApp.layertypes[layer1id] == 'polyline' || MyApp.layertypes[layer2id] == 'polyline') {

            console.log('not equal polygon')
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Both layers must be polygons';
        }else{
            layer1 = makeOneLayer(layer1id);
            layer2 = makeOneLayer(layer2id);
            intersected = turf.intersect(layer1, layer2);
            if (intersected == undefined) {
                error.style.display = 'block';
                error.addClass = 'file-error-message';
                error.innerHTML = 'Undefined intersection';
                console.log('undefined intersection');
            }else{
                var name = '_intersect_' + MyApp.layernames[layer2id];
                addToMapAndLayercontrol(layer1id, intersected, name);
            }
        }   
    }else{
        console.log('gikk inn i else');
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You have to select two polygon layers';
        console.log('you have to select two polygon layers');
    }
}

function computeDifference(){
    var layer1id = document.getElementById('difference1select').value;
    var layer2id = document.getElementById('difference2select').value;
    console.log(MyApp.layertypes[layer1id]);
    console.log(MyApp.layertypes[layer2id]);
    var error = document.getElementById('errorDifference');

    console.log("start difference");
    // console.log(dropdownId);
    console.log(MyApp.layernames);
    console.log("stop difference");


    if (layer1id != 0 && layer2id != 0) {

        layer1 = makeOneLayer(layer1id);
        layer2 = makeOneLayer(layer2id);
        difference = turf.difference(layer1, layer2);
        console.log(layer1);
        console.log(layer2);
        if (difference == undefined) {
            console.log('lolol');
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Undefined difference';
            console.log('undefined difference');
        }else if (MyApp.layertypes[layer1id] == 'polyline' || MyApp.layertypes[layer2id] == 'polyline') {
            console.log('not equal polygon')
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Both layers must be polygons';
        }else{
            console.log('did the computation');
            var name = '_diff_' + MyApp.layernames[layer2id];
            addToMapAndLayercontrol(layer1id, difference, name);
        };   
    }else{
        // var error = document.getElementById('errorDifference');
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You have to select two polygon layers';
        console.log('you have to select two polygon layers');
    }
}


function makeOneLayer(id){
    var feature = MyApp.map._layers[id];
    var layers = [];    
    var count = 0;
    var object;

    for (object in feature._layers){
        layers[count] = MyApp.map._layers[object].feature;
        count = count + 1;
    }

    var merged;
    merged = layers[0]
    for (i = 1; i < count; i++){
        merged = union(merged, layers[i]);
    }
    return merged;
}

function union(layerOne, layerTwo){
    return turf.union(layerOne, layerTwo);
}

//adds the layers to the layer control in the sidebar menu
function addToMapAndLayercontrol(id, result, text){
    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var mystyle = {
        "color": color,
        "fillColor": color,
        "weight": 1,
        "opacity": 0.8,
        "fillOpacity": 0.7, 
     };

    result = L.geoJSON(result, {style: mystyle});
    result.addTo(MyApp.map);

    var name = MyApp.layernames[id] + text;
    MyApp.layernames[result._leaflet_id] = name;


    drawLayerControl(result._leaflet_id, name);
    hideThis('#toolsPopup'); fadeOutDarkening();

    var error = document.getElementsByClassName('error');
    for(var i=0; i<error.length; i++){
        error[i].style.display = 'none';
    }
    orderLayers();
}