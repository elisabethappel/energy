mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpc2FiZXRoYXBwZWwiLCJhIjoiY2tsMTNnYTdmMmxhbjJvcW80a3M1cGQ2ZyJ9.zRFRv1-WLc3E43O5Klf8Jw';
//setting map
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [-73.966311, 40.746759], // starting position
  zoom: 12 // starting zoom
});

//add navigation control
var nav = new mapboxgl.NavigationControl();

map.addControl(nav, 'top-left');

// loading the map layers (coloured features and highlighting) on load
map.on('style.load', function() {
// retrieve geojson file
  $.getJSON('data/ll84_energy_map.geojson', function(featureCollection) {


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
          stops: [
            ['D',
              'red'
            ],
            ['C',
              'orange'
            ],
            ['B',
              'yellow'
            ],
            ['A',
              'green'
            ],
          ]
        },
        'fill-outline-color': '#ccc',
        'fill-opacity': 0.8
      }
    })
    // add a separate layer and source for the highlighting of parcels
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

// add function to display information in sidebar when parcel is selected
map.on('click', function(e) {
  var nycbbls = map.queryRenderedFeatures(e.point, {
    layers: ['nycbbls']
  });

  if (nycbbls.length > 0) {
    var hoveredFeature = nycbbls[0]

    document.getElementById('score').innerHTML = '<h4 style = "font-size:800%" "text-align:center" ><strong>' + nycbbls[0].properties.score + '</strong></h4><p><strong><em>';
    document.getElementById('mapAddress').innerHTML = 'address:<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.disclosure_pluto_address + '</h4><p><strong><em>';
    document.getElementById('mapScore').innerHTML = 'energy score:<h4 style = "font-size:600%">' + nycbbls[0].properties.disclosure_pluto_es_score + '</h4><p><strong><em>';
    document.getElementById('mapYear').innerHTML = 'year built:<h4 style = "font-size:100%" "text-align:left">' + nycbbls[0].properties.YearBuilt + '</h4><p><strong><em>';
    // set this feature as the data for the highlight source
    map.getSource('highlight-feature').setData(hoveredFeature.geometry);

  }
});




// when the mouse moves, the cursor will change to a pointer
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
// adding a search bar
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);
// displaying modal when the site loads
$(window).on('load', function() {
  $('#modal').modal('show');
});
