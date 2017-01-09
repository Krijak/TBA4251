MyApp.layernames = {};
MyApp.layertypes = {};
MyApp.layerResult = {};

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
    // console.log(churches.getBounds());
    // console.log(MyApp.allLayers._layers[53].getBounds());
    // console.log(MyApp.map._layers[53].getBounds().getCenter());



}


// function buffer(id){
//     // console.log(MyApp.map._layers[id]);
//     // var layer = L.geoJSON(MyApp.map._layers[id]);

//     // var buffered = turf.buffer(layer, 5, 'kilometers');

//     var pt = {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [63.422, 10.38]
//       }
//     };
//     var unit = 'miles';

//     var buffered = turf.buffer(pt, 500, unit);
//     var result = turf.featurecollection([buffered, pt]);

//     // L.geoJSON(buffered).addTo(MyApp.map);
//     console.log(result);

// }

function buffer(id){
    var feature = MyApp.map._layers[id];
    console.log(feature);

    for (var object in feature._layers){
        console.log(MyApp.map._layers[object].feature);
        MyApp.layerResult[object] = turf.buffer(MyApp.map._layers[object].feature, 1, 'miles');
    }
}

function afterBuffer(){
    console.log(MyApp.layerResult);
    // console.log(MyApp.layer);
    for (var object in MyApp.layerResult){
        console.log(MyApp.layerResult[object]);
        L.geoJSON(MyApp.layerResult[object]).addTo(MyApp.map);
    }
    // L.geoJSON( MyApp.layerResult).addTo(MyApp.map);
}