function initMap() {
    console.log('init');
    // default center value
    var center = {lat: -34.397, lng: 150.644};

    // create map
    var map = new google.maps.Map(document.getElementById('google-mapped-shortcode'), {
	center: center,
	zoom: 10,
	draggableCursor: 'pointer'
    });

    // create marker
    var marker = new google.maps.Marker({
	position: center,
	map: map
    });
}


