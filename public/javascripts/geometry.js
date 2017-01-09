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


        var mystyle = {
            "color": color1,
            "fillColor": color1,
            "weight": 1,
            "opacity": 0.8,
            "fillOpacity": 0.2, 
         };

         var turveistyle = {
            "color": color2,
            "fillColor": color2,
            "weight": 2,
            "opacity": 1,
            "fillOpacity": 0.8, 
         };

        var skolekretser = new L.GeoJSON.AJAX("/data/SkolekretserStav.geojson", {style: mystyle });
        skolekretser.addTo(MyApp.allLayers);

        var turveier = new L.GeoJSON.AJAX("./data/turveierStav.geojson", {style: turveistyle});       
        turveier.addTo(MyApp.allLayers);

        var elv = new L.GeoJSON.AJAX("./data/river.geojson", {style: turveistyle});       
        elv.addTo(MyApp.allLayers);
        console.log(elv);

        
        MyApp.layernames[skolekretser._leaflet_id] = 'Skolekretser';
        MyApp.layertypes[skolekretser._leaflet_id] = 'polygon';

        MyApp.layernames[turveier._leaflet_id] = 'Turveier';
        MyApp.layertypes[turveier._leaflet_id] = 'polyline';
        
        MyApp.layernames[elv._leaflet_id] = 'Elv, Trondheim';
        MyApp.layertypes[elv._leaflet_id] = 'polyline';



//NOTE TO SELF: BOUNDS MAA FINNES ETTER AT LAGENE ER PAA KARTET. PRØV DEFERRED
    // allLayers.addTo(MyApp.map);

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
        var feature = MyApp.map._layers[id];
        console.log(feature);
        var layers = [];


        var count = 0;
        var object;
        for (object in feature._layers){
            layers[count] = MyApp.map._layers[object].feature;
            count = count + 1;
        }
        console.log(layers);
        console.log(count);

        var merged;
        merged = layers[0]
        c = 0;
        for (i = 1; i < 113; i++){
            c = c+1;
            console.log(c);
            merged = union(merged, layers[i]);
        }
        console.log(merged);
        result = turf.buffer(merged, bufferDist, 'kilometers');

        result = L.geoJSON(result, {style: mystyle});
        result.addTo(MyApp.map);
        console.log(result._leaflet_id);

        var name = MyApp.layernames[id] + ' buffer ' + bufferDist*1000;
        MyApp.layernames[result._leaflet_id] = name;


        drawLayerControl(result._leaflet_id, name);
        hideThis('#toolsPopup'); fadeOutDarkening();

    }else{
        console.log("You must select a layer and/or a positive buffer value");
    }
}

function afterBuffer(){
    // buffer().addTo(MyApp.map);

    // console.log(MyApp.layerResult);
    // var result = MyApp.map._layers[id];

    // for (var object in MyApp.layerResult){
    //     result = union(result, MyApp.layerResult[object])

    //     // L.geoJSON(MyApp.layerResult[object]).addTo(MyApp.map);
    // }
    console.log(MyApp.result);
    MyApp.result.addTo(MyApp.map);
}

function union(layerOne, layerTwo){
    return turf.union(layerOne, layerTwo);
}