function addToMap(isDefault){
    // var allLayers = new L.geoJson();
    var allLayers = new L.LayerGroup();
    var defaultLayerStyle = {
        "color": "#ffffff",
        "weight": 2,
        "opacity": 0.65
    };

    $.ajax({
        dataType: "json",
        url: "users",
        success: function(data) {
            console.log(data);
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
        
        parks.addTo(allLayers);
        churches.addTo(allLayers);
        river.addTo(allLayers);
        parks.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    }
    allLayers.addTo(MyApp.map);


}
// console.log(MyApp.map);