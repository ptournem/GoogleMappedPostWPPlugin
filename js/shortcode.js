function initMap() {
    var newestControl, previousControl, nextControl, oldestControl;
    var currentSelected = null;
    // default center value
    var center = {lat: -34.397, lng: 150.644};

    // create map
    var map = new google.maps.Map(document.getElementById('google-mapped-shortcode'), {
	center: center,
	zoom: 10,
	draggableCursor: 'pointer'
    });

    // add markers and paths
    var markers = [];
    var lastPos = null;
    jQuery.each(GoogleMappedPosts, function (index, item) {
	var pos = unformatLatLng(item.location);
	var marker = new google.maps.Marker({
	    position: pos,
	    map: map
	});

	if (lastPos != null) {
	    drawLine(pos, lastPos);
	}

	lastPos = pos;

	markers.push(marker);
    });

    // Create the DIV to hold the control and call the NavigatePostControl() constructor
    // passing in this DIV.
    var navigatePostControlDiv = document.createElement('div');
    new NavigatePostControl(navigatePostControlDiv, map);


    // adding the control
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(navigatePostControlDiv);

    // on init : select the last post
    selectPost(0);

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
     * Draw a line between to position
     * @param {position} posA
     * @param {position} posB
     * @returns {undefined}
     */
    function drawLine(posA, posB) {
	var dashedSymbol = {
	    path: 'M 0,-1  0,0',
	    strokeOpacity: 1,
	    scale: 4
	};
	var line = new google.maps.Polyline({
	    path: [posA, posB],
	    strokeColor: '#FF5555',
	    strokeOpacity: 0,
	    icons: [{
		    icon: dashedSymbol,
		    offset: '0',
		    repeat: '20px'
		}],
	    map: map
	});
    }

    /**
     * Select the post on the map
     * @param {type} id
     * @returns {undefined}
     */
    function selectPost(id) {
	// todo : verify if the id exists
	currentSelected = id;
	map.panTo(unformatLatLng(GoogleMappedPosts[id].location));

	// todo block previous , next when not possible;

    }

    /**
     * Add the navigatePostControl
     * @constructor
     */
    function NavigatePostControl(controlDiv, map) {

	controlDiv.index = 1;

	newestControl = getNewControl("Newest", "<<", controlDiv, function () {
	    selectPost(GoogleMappedPosts.length - 1);
	});
	previousControl = getNewControl("Previous", "<", controlDiv, function () {
	    selectPost(currentSelected + 1);
	});
	nextControl = getNewControl("Next", ">", controlDiv, function () {
	    selectPost(currentSelected - 1);
	});
	oldestControl = getNewControl("Latest", ">>", controlDiv, function () {
	    selectPost(0);
	});


    }

    /**
     * Get a new control post navigation control
     * @param {string} title
     * @param {string} text
     * @param {DOMElement} appendTo
     * @param {function} callback
     * @returns {initMap.getNewControl.controlUI}
     */
    function getNewControl(title, text, appendTo, callback) {
	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#fff';
	controlUI.style.border = '2px solid #fff';
	controlUI.style.borderRadius = '3px';
	controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	controlUI.style.cursor = 'pointer';
	controlUI.style.marginBottom = '22px';
	controlUI.style.marginLeft = "5px";
	controlUI.style.minWidth = "40px";
	controlUI.style.textAlign = 'center';
	controlUI.style.float = 'left';
	controlUI.title = title;
	appendTo.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.color = 'rgb(25,25,25)';
	controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	controlText.style.fontSize = '16px';
	controlText.style.lineHeight = '38px';
	controlText.style.paddingLeft = '5px';
	controlText.style.paddingRight = '5px';
	controlText.innerHTML = text;
	controlUI.appendChild(controlText);

	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener('click', callback);

	// return the control
	return controlUI;
    }


}


