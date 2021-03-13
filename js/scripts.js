mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpc2FiZXRoYXBwZWwiLCJhIjoiY2tsMTNnYTdmMmxhbjJvcW80a3M1cGQ2ZyJ9.zRFRv1-WLc3E43O5Klf8Jw';

var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.992313,40.678211], // starting position [lng, lat]
  zoom: 10 // starting zoom
});

var nav = new mapboxgl.NavigationControl();

map.addControl(nav, 'top-right');


map.on('style.load', function () {
  // adding geojson source data, downloaded from external site
  // we need to load the data manually because our population properties are strings and not numbers!!!

  //load legend on map load
  var layers = ['0-55', '55-70', '70-85', '85-100'];
  var colors = ['red', 'orange', 'yellow', 'green'];

  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
}

 $.getJSON('data/ll84_energy_map.geojson', function(featureCollection) {

   // iterate over each feature in the FeatureCollection and convert the pop2010 property to a number
   featureCollection.features.forEach(function(feature) {
     feature.properties.disclosure_pluto_es_score = parseInt(feature.properties.disclosure_pluto_es_score)
   })

   console.log(featureCollection)
   console.log('hello')

   //console.log('style loaded')
   // override the fill color of the water layer
   //map.setPaintProperty('water', 'fill-color', '#c9f4ff');

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

map.on('mousemove', function(e) {
  var nycbbls = map.queryRenderedFeatures(e.point, {
    layers: ['nycbbls']
  });

  if (nycbbls.length > 0) {
    document.getElementById('pd').innerHTML = '<h3><strong>' + nycbbls[0].properties.score + '</strong></h3><p><strong><em>';
    map.getCanvas().style.cursor = 'pointer';
  } else {
    document.getElementById('pd').innerHTML = '';
    map.getCanvas().style.cursor = '';
  }
});
