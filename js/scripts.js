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

   map.addSource('highlight-feature', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    })

    map.addLayer({
      id: 'highlight-line',
      type: 'line',
      source: 'highlight-feature',
      paint: {
        'line-width': 2,
        'line-opacity': 1,
        'line-color': 'black',
      }
    });



 })
})

map.on('click', function(e) {
  var nycbbls = map.queryRenderedFeatures(e.point, {
    layers: ['nycbbls']
  });

  if (nycbbls.length > 0) {
    var hoveredFeature = nycbbls[0]

    document.getElementById('score').innerHTML = '<h4 style = "font-size:800%" "text-align:center" ><strong>' + nycbbls[0].properties.score + '</strong></h4><p><strong><em>';
    document.getElementById('mapAddress').innerHTML = 'address:<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.disclosure_pluto_address + '</h4><p><strong><em>';
    document.getElementById('mapScore').innerHTML = 'energy score:<h4 style = "font-size:600%">' + nycbbls[0].properties.disclosure_pluto_es_score + '</h4><p><strong><em>';
    document.getElementById('mapYear').innerHTML = 'year built:<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.YearBuilt+ '</h4><p><strong><em>';
    // set this feature as the data for the highlight source
    map.getSource('highlight-feature').setData(hoveredFeature.geometry);

  } else {
    document.getElementById('score').innerHTML = '';
    document.getElementById('mapAddress').innerHTML = '';
    document.getElementById('mapScore').innerHTML = '';
    document.getElementById('mapYear').innerHTML = '';
    // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      });
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
