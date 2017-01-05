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

    if(isDefault){
        var parks = new L.geoJson();
        parks.setStyle({
            color: 'red',
        });
        $.ajax({
        dataType: "json",
        url: "./data/SkolekretserStav.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                parks.addData(data);
            });
        }
        }).error(function() {});


        var churches = new L.geoJson();
        $.ajax({
        dataType: "json",
        url: "./data/turveierStav.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                churches.addData(data);
                // churches.getBounds();
                // console.log(churches.getBounds());
            });
        }
        }).error(function() {});

        var river = new L.geoJson();
        $.ajax({
        dataType: "json",
        url: "./data/river.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                river.addData(data);
            });
        }
        }).error(function() {});

        }
        // parks.addTo(MyApp.allLayers);
        // churches.addTo(MyApp.allLayers);
         var mystyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65 
         };

        // var skolekretser = new L.GeoJSON.AJAX("./data/SkolekretserStav.geojson");
        var geoJsonLayer = new L.GeoJSON.AJAX("/data/SkolekretserStav.geojson", {
        style: mystyle });
        // geoJsonLayer.addTo(MyApp.map);
        geoJsonLayer.addTo(MyApp.allLayers);
        // skolekretser.addTo(MyApp.allLayers);     

        var turveier = new L.GeoJSON.AJAX("./data/turveierStav.geojson");       
        // skolekretser.addTo(MyApp.map);
        turveier.addTo(MyApp.allLayers);    
        // console.log(turveier);

        // parks.addStyle(style);
        // MyApp.layernames[skolekretser._leaflet_id] = 'Skolekretser';
        MyApp.layernames[turveier._leaflet_id] = 'Turveier';



//NOTE TO SELF: BOUNDS MAA FINNES ETTER AT LAGENE ER PAA KARTET. PRØV DEFERRED
    // allLayers.addTo(MyApp.map);

    $.when($.ajax(MyApp.allLayers.addTo(MyApp.map))).then(function () {
        // console.log(allLayers);
        // MyApp.map.fitBounds(allLayers.getBounds());
    });
    // console.log(allLayers);
    // console.log(allLayers._layers);
    // console.log(allLayers._layers[51]);

    for (var object in MyApp.allLayers._layers){
        name = MyApp.layernames[object];
        drawLayerControl(object, name);
        console.log(MyApp.allLayers._layers[object]);
    }
    // console.log(churches.getBounds());
    // console.log(MyApp.allLayers._layers[53].getBounds());
    // console.log(MyApp.map._layers[53].getBounds().getCenter());



}
