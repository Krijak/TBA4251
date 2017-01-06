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

        
        MyApp.layernames[skolekretser._leaflet_id] = 'Skolekretser';
        MyApp.layernames[turveier._leaflet_id] = 'Turveier';
        MyApp.layernames[elv._leaflet_id] = 'Elv, Trondheim';



//NOTE TO SELF: BOUNDS MAA FINNES ETTER AT LAGENE ER PAA KARTET. PRØV DEFERRED
    // allLayers.addTo(MyApp.map);

    $.when($.ajax(MyApp.allLayers.addTo(MyApp.map))).then(function () {
        console.log(MyApp.allLayers);
    });    

        // MyApp.map.removeLayer(MyApp.map._layers[turveier._leaflet_id]);
        // MyApp.allLayers._layers[turveier._leaflet_id].addTo(MyApp.map);
        // console.log("YOLO");


        // console.log(allLayers);
        // MyApp.map.fitBounds(allLayers.getBounds());
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
