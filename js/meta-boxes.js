function initMap() {
    // default center value
    var center = {lat: -34.397, lng: 150.644};

    // input text dom element
    var input = document.getElementById('google-mapped-post-coord');

    // create map
    var map = new google.maps.Map(document.getElementById('map'), {
	center: center,
	zoom: 10,
	draggableCursor: 'pointer'
    });

    // create marker
    var marker = new google.maps.Marker({
	position: center,
	map: map
    });

    // on click, set input value, move marker
    map.addListener('click', function (e) {
	input.value = formatLatLng(e.latLng);
	setMarketAndMapPos(e.latLng);
	marker.setAnimation(google.maps.Animation.BOUNCE)
	window.setTimeout(function () {
	    marker.setAnimation(null);
	}, 2000);
    });

    // on init, try to unformat input value to set initial location
    // or try to get geolocation value
    if (matchLatLngFormat(input.value)) {
	setMarketAndMapPos(unformatLatLng(input.value));
    }
    else if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (position) {
	    var pos = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	    };
	    setMarketAndMapPos(pos);
	});
    }

    /**
     * Move the marker and pan map to pos
     * @param {LatLng} pos
     * @returns {undefined}
     */
    function setMarketAndMapPos(pos) {
	marker.setPosition(pos);
	map.panTo(pos);
    }

    /**
     * Forma LatLng to text
     * @param {LatLng} latLng
     * @returns {String}
     */
    function formatLatLng(latLng) {
	return latLng.lat() + ";" + latLng.lng();
    }

    /**
     * Unformat string to a LatLng Object
     * @param {String} strLatLng
     * @returns {LatLng}
     */
    function unformatLatLng(strLatLng) {
	var latLng = strLatLng.split(";");
	return ret = {
	    lat: parseFloat(latLng[0]),
	    lng: parseFloat(latLng[1])
	};
    }

    /**
     * Verify the value match the LatLng format
     * @param {String} value
     * @returns {Boolean}
     */
    function matchLatLngFormat(value) {
	return /-?[0-9\.]+;-?[0-9\.]+/.test(value);
    }
}


