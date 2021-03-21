mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpc2FiZXRoYXBwZWwiLCJhIjoiY2tsMTNnYTdmMmxhbjJvcW80a3M1cGQ2ZyJ9.zRFRv1-WLc3E43O5Klf8Jw';

var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.966311,40.746759], // starting position [lng, lat]
  zoom: 12 // starting zoom
});

var nav = new mapboxgl.NavigationControl();

map.addControl(nav, 'top-left');


map.on('style.load', function () {
  // adding geojson source data, downloaded from external site
  // we need to load the data manually because our population properties are strings and not numbers!!!

  //load legend on map load
//  var layers = ['0-55', '55-70', '70-85', '85-100'];
//  var colors = ['red', 'orange', 'yellow', 'green'];

//  for (i = 0; i < layers.length; i++) {
//    var layer = layers[i];
//    var color = colors[i];
//    var item = document.createElement('div');
//    var key = document.createElement('span');
//    key.className = 'legend-key';
//    key.style.backgroundColor = color;

//    var value = document.createElement('span');
//    value.innerHTML = layer;
//    item.appendChild(key);
//    item.appendChild(value);
//    legend.appendChild(item);
//}

 $.getJSON('data/ll84_energy_map.geojson', function(featureCollection) {

   featureCollection.features.forEach(function(feature) {
     feature.properties.disclosure_pluto_es_score = parseInt(feature.properties.disclosure_pluto_es_score)
   })


   // add a geojson source
   map.addSource('nyc-bbls', {
     type: 'geojson',
     data: featureCollection
   });

   // add a layer to style and display the source
   map.addLayer({
     'id': 'nycbbls',
     'type': 'fill',
     'source': 'nyc-bbls',
     'layout': {},
     'paint': {
       'fill-color': {
         property: 'score',
         type: 'categorical',
         stops:[
         ['D',
         'red'],
         ['C',
         'orange'],
         ['B',
         'yellow'],
         ['A',
         'green'],
       ]
      },
       'fill-outline-color': '#ccc',
       'fill-opacity': 0.8
     }
   })


 })
})

map.on('click', function(e) {
  var nycbbls = map.queryRenderedFeatures(e.point, {
    layers: ['nycbbls']
  });

  if (nycbbls.length > 0) {
    document.getElementById('score').innerHTML = '<h4 style = "font-size:800%" "text-align:center" ><strong>' + nycbbls[0].properties.score + '</strong></h4><p><strong><em>';
    document.getElementById('mapAddress').innerHTML = 'address:<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.disclosure_pluto_address + '</h4><p><strong><em>';
    document.getElementById('mapScore').innerHTML = 'energy score:<h4 style = "font-size:600%">' + nycbbls[0].properties.disclosure_pluto_es_score + '</h4><p><strong><em>';
    document.getElementById('mapGHG').innerHTML = 'total ghg (tons):<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.disclosure_pluto_total_ghg + '</h4><p><strong><em>';
  } else {
    document.getElementById('score').innerHTML = '';
    document.getElementById('mapAddress').innerHTML = '';
    document.getElementById('mapScore').innerHTML = '';
    document.getElementById('mapGHG').innerHTML = '';
  }
});





map.on('mousemove', function(d) {
  var nycbbls = map.queryRenderedFeatures(d.point, {
    layers: ['nycbbls']
  });
  if (nycbbls.length > 0) {
    map.getCanvas().style.cursor = 'pointer';
  } else {
    map.getCanvas().style.cursor = '';
}
});

map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
})
);

$(window).on('load', function() {
       $('#modal').modal('show');
   });
