
function createMap() {
	var map;
	var mapOptions = {
		center: new google.maps.LatLng(-1.4558333333, -48.5027777778),
		zoom: 15, 
		disableDoubleClickZoom: true,
		draggable: true,
		streetViewControl: true,
	};
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	console.log(map)
};

function loadTheMap(){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1qCeTpnDCkDd1veNtsBUe2BEpw-o4c4s&callback=createMap&libraries=drawing,visualization,geometry&amp;sensor=false&amp;language=pt&amp;region=BR';
	document.body.appendChild(script);
};

//window.onload = loadTheMap;
