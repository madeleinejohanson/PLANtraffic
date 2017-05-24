 var filterGroup = document.getElementById('filter-group');
mapboxgl.accessToken = 'pk.eyJ1IjoibWFkZWxlaW5lam9oYW5zb24iLCJhIjoiY2lzczduYzJ4MDZrODJucGh0Mm1xbmVxNCJ9.i7q4iT8FFgh_y5v4we5UhQ';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v9',
    center: [151.004105, -33.813002],

    // homebush [151.08223, -33.8680],
    // sydney pier [151.2056, -33.8572],
    zoom: 18,
    pitch: 45,
    bearing: -17.6,
    container: 'map'
});
map.on('load', function() {

    map.addSource('json-buildings', {
                    'type': 'geojson',
                    'data': './GeoJSON/tower_1.GeoJSON'
                }),

    map.addLayer({
        "id": "fromgrasshopper",
        "type": "fill-extrusion",
        "source": "json-buildings",
           'paint': {
                'fill-extrusion-color' : {
                    'property': 'colour',
                    'type': 'identity'
                },
                'fill-extrusion-height' : {
                    'type': 'identity',
                    'property': 'height'
                },
                'fill-extrusion-base' : {
                    'type': 'identity',
                    'property': 'base_height'
                },
                 'fill-extrusion-opacity': .6
            }
    });

        // When a click event occurs near a polygon, open a popup at the location of
      // the feature, with description HTML from its properties.
      map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: [ "fromgrasshopper"] });
       if (!features.length) {
        return;
      }

    var feature = features[0];
    var feat = features.length;

    var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))
        .setHTML([feature.properties.layer] + ["<br>"] + [feature.properties.tag])
        .addTo(map);

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [ "fromgrasshopper"] });
    map.getCanvas().style.cursor = feat ? 'pointer' : '';
});

        buttonVals = new Set([])

        function layerGetter(feature){
            layerVal = feature["properties"]["layer"]
            buttonVals.add(layerVal) //set
            console.log(buttonVals)
        }

       //'json-buildings'.features.forEach(layerGetter) WHAAAAATTTTT??? LAYER HELP

        buttonMenu = Array.from(buttonVals) //iterator 


            // Add checkbox and layer elements for the layer.
          selectedSet= new Set 
            for (var i in buttonMenu) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = buttonMenu[i];
            input.checked = true;
            filterGroup.appendChild(input);

            var layer = document.createElement('layer');
            layer.setAttribute('for', buttonMenu[i]);
            layer.textContent = buttonMenu[i];
            filterGroup.appendChild(layer);
          


          input.addEventListener('change', function(e) {

            id = e.target.checked?e.target.id:0
            if (id==0){
              selectedSet.delete(e.target.id)
            }else{
              selectedSet.add(e.target.id)
            }
            hiddenElements = Array.from(selectedSet)
            console.log(hiddenElements)
          
          hiddenFilters = ["any"]
          hiddenElements.forEach((element) => {
          hiddenFilters.push([
            '==',
            'tag',
            element.toString()
                ]);
          });
          console.log(JSON.stringify(hiddenFilters))
          map.setFilter( 'fromgrasshopper', hiddenFilters);
            

});
        }
    
        })

});


map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 200,
    unit: 'metric'
}));

map.addControl(new mapboxgl.NavigationControl(), ['top-right']);