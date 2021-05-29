
mapboxgl.accessToken ='pk.eyJ1IjoiYWphenNhaWZpMCIsImEiOiJja29lb3NycjAwMWVkMzBtYXNwM2V4YW10In0.7dzu9mvyUuLakwN7YJNhqg' ;
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center:campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h5>Monument here<h5>
            <p>
            follow this path to get here
            </p>`
        )
    )
    .addTo(map);