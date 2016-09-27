function initMap() {
    var newestControl, previousControl, nextControl, oldestControl;
    var currentSelected = null;
    var firstLoad = true;
    // default center value
    var center = {lat: -34.397, lng: 150.644};

    // create map
    var el = document.getElementById('google-mapped-shortcode');
    var map = new google.maps.Map(el, {
	center: center,
	zoom: parseInt(el.getAttribute('attr-zoom'))
    });

    var infoWindowContent = document.createElement('div');

    var infowindow = new google.maps.InfoWindow({
	content: infoWindowContent
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

	// on click : open related infoWindow
	marker.addListener('click', function () {
	    selectPost(index);
	});

	// draw line between actual position and last position if not null
	if (lastPos !== null) {
	    drawLine(pos, lastPos);
	}

	// save last position
	lastPos = pos;

	// save marker in an array
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
	// verify if the id exists
	if (id < 0 || id >= GoogleMappedPosts.length) {
	    return;
	}

	// save the selected post
	currentSelected = id;
	// move to the selected post
	infowindow.close();
	setInfoWindowsContent(GoogleMappedPosts[id]);
	console.log(firstLoad);
	window.setTimeout(function () {
	    map.panTo(unformatLatLng(GoogleMappedPosts[id].location));
	    window.setTimeout(function () {
		infowindow.open(map, markers[id]);
	    }, (firstLoad ? 8000 : 300));
	}, (firstLoad ? 800 : 100));

	firstLoad = false;


	// ensure , the user is shown that he can click anymore on some control
	switch (currentSelected) {
	    case 0:
		enableControl(oldestControl, false);
		enableControl(nextControl, false);
		if (GoogleMappedPosts.length > 1) {
		    enableControl(newestControl, true);
		    enableControl(previousControl, true);
		} else {
		    enableControl(newestControl, false);
		    enableControl(previousControl, false);
		}
		break;
	    case (GoogleMappedPosts.length - 1):
		enableControl(oldestControl, true);
		enableControl(nextControl, true);
		enableControl(newestControl, false);
		enableControl(previousControl, false);
		break;
	    default:
		enableControl(newestControl, true);
		enableControl(previousControl, true);
		enableControl(oldestControl, true);
		enableControl(nextControl, true);
		break
	}

    }

    function setInfoWindowsContent(el) {
	var html = '';
	if (el.thumbnail !== false) {
	    html += '<img style="float:right; height:150px;"src="' + el.thumbnail + '" alt="thumbnail"/>';
	}
	html += '<div style="clear:none;">';
	html += '<h3 style="margin:0px; clear:none;">' + el.title + "</h3>";
	html += '<i>' + el.date + "</i>";
	html += '<p>' + el.content + "</p>";
	html += '<a style="position:absolute;bottom:0px;" href="' + el.link + '" target="_blank">voir l\'article </a>';
	html += '</div>';

	infoWindowContent.innerHTML = html;
    }

    function enableControl(control, enabled) {
	if (enabled) {
	    control.style.backgroundColor = '#fff';
	    control.style.border = '2px solid #fff';
	    control.style.cursor = 'pointer';
	    control.style.color = 'rgb(25,25,25)';
	} else {
	    control.style.backgroundColor = 'lightgrey';
	    control.style.border = '2px solid lightgrey';
	    control.style.cursor = 'not-allowed';
	    control.style.color = 'grey';
	}
    }


    /**
     * Add the navigatePostControl
     * @constructor
     * @param {type} controlDiv
     * @param {type} map
     * @returns {undefined}
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
	controlUI.style.color = 'rgb(25,25,25)';
	controlUI.style.marginBottom = '22px';
	controlUI.style.marginLeft = "5px";
	controlUI.style.minWidth = "40px";
	controlUI.style.textAlign = 'center';
	controlUI.style.float = 'left';
	controlUI.title = title;
	appendTo.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');

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


