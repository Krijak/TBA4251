MyApp.layernames = {};

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


        var mystyle = {
            "color": '#'+(Math.random()*0xFFFFFF<<0).toString(16),
            "weight": 2,
            "opacity": 0.8 
         };

         var turveistyle = {
            "color": "#fff",
            "weight": 1,
            "opacity": 1, 
         };

        var skolekretser = new L.GeoJSON.AJAX("/data/SkolekretserStav.geojson", {
            style: mystyle });
        skolekretser.addTo(MyApp.allLayers);

        var turveier = new L.GeoJSON.AJAX("./data/turveierStav.geojson", {style: mystyle});       
        turveier.addTo(MyApp.allLayers);
        // turveier.getBounds();
        console.log(turveier.getBounds());

        
        MyApp.layernames[skolekretser._leaflet_id] = 'Skolekretser';
        MyApp.layernames[turveier._leaflet_id] = 'Turveier';



//NOTE TO SELF: BOUNDS MAA FINNES ETTER AT LAGENE ER PAA KARTET. PRØV DEFERRED
    // allLayers.addTo(MyApp.map);

    $.when($.ajax(MyApp.allLayers.addTo(MyApp.map))).then(function () {
        MyApp.map._layers[turveier._leaflet_id].setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });    

        // MyApp.map.removeLayer(MyApp.map._layers[turveier._leaflet_id]);
        // MyApp.allLayers._layers[turveier._leaflet_id].addTo(MyApp.map);
        // console.log("YOLO");


        // console.log(allLayers);
        // MyApp.map.fitBounds(allLayers.getBounds());
    });
    // console.log(allLayers);
    // console.log(allLayers._layers);
    // console.log(allLayers._layers[51]);

    for (var object in MyApp.allLayers._layers){
        name = MyApp.layernames[object];
        drawLayerControl(object, name);
        // console.log(MyApp.allLayers._layers[object]);
    }
    // console.log(churches.getBounds());
    // console.log(MyApp.allLayers._layers[53].getBounds());
    // console.log(MyApp.map._layers[53].getBounds().getCenter());



}
