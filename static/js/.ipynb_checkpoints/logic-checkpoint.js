

var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var plate_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


function markerSize(magnitude) {
    return magnitude * 4;
};

var earthquake = new L.LayerGroup();

d3.json(earthquake_url, function (geoJson) {
    //Create Marker
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },
        // Add pop-up with related information 
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
    createMap(earthquake);
});

var faultline = new L.LayerGroup();

d3.json(plate_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'blue'
            }
        },
    }).addTo(faultline);
})
function createMap() {
   // Tile layer (initial map) whhich comes from map Box
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });

    // Layers   
    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
         
    };
    var overlays = {
        "Tectonic Plates": faultline,
        "Earthquakes": earthquake,
        
    };

    //Intiate Leaflet map (map id)  
    var mymap = L.map('map', {
        //Recenter the map
        center: [37.8968, -119.5828],
        zoom: 3.5,
        layers: [satellite, earthquake, faultline]
    });

    
    L.control.layers(baseLayers, overlays).addTo(mymap);
 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        //Magnitude 
        Grade = [0,1, 2, 3, 4, 5];
        labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

         for (var i = 0; i < Grade.length; i++) {
             div.innerHTML +=
             '<div class="color-box" align="center" style= background-color:' + Color(Grade[i] + 1) + ' >'
             + Grade[i] + (Grade[i + 1] ? '&ndash;' + Grade[i + 1] + '<br>' : '+')
        }

        return div;
    };
    legend.addTo(mymap);
}   // Function for Color of the marker related to the magnitude of the earthquake.
    function Color(magnitude) {
        if (magnitude > 5) {
          return  "#e76818";
        } else if (magnitude > 4) {
            return "#f29e2e";
        } else if (magnitude > 3) {
            return "#f9d057";
        } else if (magnitude > 2) {
            return "#90eb9d";
        } else if (magnitude > 1) {
            return "#00ccbc";
        } else {
            return 'green'
        }
      };
