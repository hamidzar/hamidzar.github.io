

var earthquake1_url = []
earthquake_url[1] = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
earthquake_url[2] = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
earthquake_url[3] = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
earthquake_url[4] = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


function markerSize(magnitude) {
    return magnitude * 4;
};
i=1
var earthquake = []
earthquake[i] = new L.LayerGroup();

d3.json(earthquake_url[i], function (geoJson) {
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
    }).addTo(earthquake[i]);
    createMap(earthquake[i]);
});



function createMap() {
   // Tile layer (initial map) whhich comes from map Box

    var tiles = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

   
    var terrain_rgb = L.tileLayer('https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });

     var Terrian = L.tileLayer('https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        // Type of map box
        id: 'mapbox.Terrian',
        accessToken: API_KEY
    });

    // Layers   
    var baseLayers = {
        "Tiles": tiles,
        "Satellite": satellite,
        "Terrain-RGB": terrain_rgb,
        "Terrian": Terrian
         
    };
    var overlays = {
        "Past Hour": i=1,
        "Past Day": 1=2,
        "Past 7 Days": i=3,
        "Past 30 Days": i=4,
    };

  
    //Intiate Leaflet map (map id)  
    var mymap = L.map('map', {
        //Recenter the map
        center: [37.8968, -119.5828],
        zoom: 3.5,
        layers: [satellite, earthquake[1]]
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
