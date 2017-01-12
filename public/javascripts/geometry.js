MyApp.layernames = {};
MyApp.layertypes = {};
MyApp.layerResult = {};
MyApp.result;

function addToMap(isDefault){
    // var allLayers = new L.geoJson();
    MyApp.allLayers = new L.FeatureGroup();
    var defaultLayerStyle = {
        "color": "#ffffff",
        "weight": 2,
        "opacity": 0.65
    };

    $.ajax({
        dataType: "json",
        url: "users",
        success: function(data) {
            // console.log(data);
        }
        }).error(function() {});

       var color1 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
       var color2 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
       var color3 = '#'+(Math.random()*0xFFFFFF<<0).toString(16);



        var style1 = {
            "color": color1,
            "fillColor": color1,
            "weight": 1,
            "opacity": 0.8,
            "fillOpacity": 1, 
         };

         var style2 = {
            "color": color2,
            "fillColor": color2,
            "weight": 2,
            "opacity": 1,
            "fillOpacity": 1, 
         };

         var style3 = {
            "color": color3,
            "fillColor": color3,
            "weight": 2,
            "opacity": 1,
            "fillOpacity": 1, 
         };

        // var skolekretser = new L.GeoJSON.AJAX("/data/SkolekretserStav.geojson", {style: mystyle });
        // skolekretser.addTo(MyApp.allLayers);

        // var turveier = new L.GeoJSON.AJAX("./data/turveierStav.geojson", {style: turveistyle});       
        // turveier.addTo(MyApp.allLayers);

        // var elv = new L.GeoJSON.AJAX("./data/river.geojson", {style: turveistyle});       
        // elv.addTo(MyApp.allLayers);

        
        // MyApp.layernames[skolekretser._leaflet_id] = 'Skolekretser';
        // MyApp.layertypes[skolekretser._leaflet_id] = 'polygon';

        // MyApp.layernames[turveier._leaflet_id] = 'Turveier';
        // MyApp.layertypes[turveier._leaflet_id] = 'polyline';
        
        // MyApp.layernames[elv._leaflet_id] = 'Elv, Trondheim';
        // MyApp.layertypes[elv._leaflet_id] = 'polyline';




        var arealbruk = new L.GeoJSON.AJAX("./data/Trondheim/arealbruk.geojson", {style: style1 });
        arealbruk.addTo(MyApp.allLayers);
        
        var veg = new L.GeoJSON.AJAX("./data/Trondheim/Vei_buffer20.geojson", {style: style3});       
        veg.addTo(MyApp.allLayers);

        var vann = new L.GeoJSON.AJAX("./data/Trondheim/vann.geojson", {style: style2});       
        vann.addTo(MyApp.allLayers);
        
        MyApp.layernames[arealbruk._leaflet_id] = 'Arealbruk';
        MyApp.layertypes[arealbruk._leaflet_id] = 'polygon';

        MyApp.layernames[vann._leaflet_id] = 'Vann';
        MyApp.layertypes[vann._leaflet_id] = 'polygon';

        MyApp.layernames[veg._leaflet_id] = 'Vei';
        MyApp.layertypes[veg._leaflet_id] = 'polyline';

        $.when($.ajax(MyApp.allLayers.addTo(MyApp.map))).then(function () {
            // console.log(MyApp.allLayers);
        });
 

    for (var object in MyApp.allLayers._layers){
        name = MyApp.layernames[object];
        drawLayerControl(object, name);
        // console.log(MyApp.allLayers._layers[object]);
    }

}


function buffer(){
    var id = document.getElementById('bufferSelect').value;
    var bufferDist = document.getElementById('bufferInput').value;

    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var mystyle = {
        "color": color,
        "fillColor": color,
        "weight": 1,
        "opacity": 0.8,
        "fillOpacity": 0.2, 
     };

    if (id != 0 && bufferDist > 0) {
        bufferDist = bufferDist/1000;
        var merged = makeOneLayer(id);
        result = turf.buffer(merged, bufferDist, 'kilometers');
        // console.log(merged);
        // console.log(result);

        addToMapAndLayercontrol(id, result, '_buffer' + bufferDist*1000);

    }else{
        var error = document.getElementById('errorBuffer');
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You must select a layer and/or a positive buffer value';
        console.log("You must select a layer and/or a positive buffer value");
    }
}


function union(layerOne, layerTwo){
    return turf.union(layerOne, layerTwo);
}


function merge(){
    var layer1id = document.getElementById('merge1select').value;
    var layer2id = document.getElementById('merge2select').value;
    var error = document.getElementById('errorUnite');

    if (layer1id != 0 && layer2id != 0) {
         if (MyApp.layertypes[layer1id] != 'polygon' || MyApp.layertypes[layer2id] != 'polygon') {
            console.log('not equal polygon')
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Both layers must be polygons';
        }else{
            layer1 = makeOneLayer(layer1id);
            layer2 = makeOneLayer(layer2id);
            merged = turf.union(layer1, layer2);
            var name = '_merged_' + MyApp.layernames[layer2id];   
            addToMapAndLayercontrol(layer1id, merged, name);
        }
    }else{
        error.style.display = 'block';
        error.addClass = 'file-error-message';
        error.innerHTML = 'You have to select two polygon layers';
        console.log('you have to select two polygon layers');
    }
}

function intersect(){
    var layer1id = document.getElementById('intersect1select').value;
    var layer2id = document.getElementById('intersect2select').value;
    var error = document.getElementById('errorIntersect');

    if (layer1id != 0 && layer2id != 0) {
        if (MyApp.layertypes[layer1id] != 'polygon' || MyApp.layertypes[layer2id] != 'polygon') {
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

function difference(){
    var layer1id = document.getElementById('difference1select').value;
    var layer2id = document.getElementById('difference2select').value;
    console.log(MyApp.layertypes[layer1id]);
    console.log(MyApp.layertypes[layer2id]);
    var error = document.getElementById('errorDifference');


    if (layer1id != 0 && layer2id != 0) {

        difference = turf.difference(layer1, layer2);
        if (difference == undefined) {
            console.log('lolol');
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Undefined difference';
            console.log('undefined difference');
        }else if (MyApp.layertypes[layer1id] != 'polygon' || MyApp.layertypes[layer2id] != 'polygon') {
            console.log('not equal polygon')
            error.style.display = 'block';
            error.addClass = 'file-error-message';
            error.innerHTML = 'Both layers must be polygons';
        }else{
            layer1 = makeOneLayer(layer1id);
            layer2 = makeOneLayer(layer2id);
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

function addToMapAndLayercontrol(id, result, text){
    var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var mystyle = {
        "color": color,
        "fillColor": color,
        "weight": 1,
        "opacity": 0.8,
        "fillOpacity": 0.2, 
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