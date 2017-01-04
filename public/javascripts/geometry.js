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
            color: '#666',
        });
        $.ajax({
        dataType: "json",
        url: "./data/SkolekretserStav.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                parks.addData(data);
                // console.log(parks.getBounds());
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
        // parks.setStyle(defaultLayerStyle);
        
        parks.addTo(MyApp.allLayers);
        churches.addTo(MyApp.allLayers);
        // river.addTo(allLayers);
        parks.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    }

    // parkbounds = parks.getBounds();
    // console.log(parkbounds);
    // console.log(river.getBounds());
    // console.log(churches.getBounds());

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
        drawLayerControl(object);
    }
    console.log(churches.getBounds());
    console.log(MyApp.allLayers._layers[53].getBounds());
    console.log(MyApp.map._layers[53].getBounds().getCenter());



}
// console.log(MyApp.map);
function panToLayers(layerGroup){
    return layerGroup.getBounds();
    // MyApp.map.fitBounds(bounds);
    
}

function getCenterPolygon(){

}

function getCenterPolyline(){

}
