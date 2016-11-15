function addToMap(){
    var district_boundary = new L.geoJson();
    // district_boundary.addTo(MyApp.map);

    $.ajax({
    dataType: "json",
    url: "./data/parks.geojson",
    success: function(data) {
        $(data.features).each(function(key, data) {
            district_boundary.addData(data);
        });
    }
    }).error(function() {});
}
// console.log(MyApp.map);