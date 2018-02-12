


var markers = [];


function initMap(){


	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 40.7413549, lng: -73.9980244},
		zoom: 13,
		mapTypeControl: false

	});


	var locations = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];

    var largeInfoWindow = new google.maps.InfoWindow();

    for(var i = 0; i < locations.length; i++){
    	var position = locations[i].location;
    	var title = locations[i].title
    	
    	var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.Drop,
            id: i
          });

    	markers.push(marker);

    	marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
         });


    };

    document.getElementById('show-listings').addEventListener('click', showlistings);
    document.getElementById('hide-listings').addEventListener('click', hidelistings);
    document.getElementById('submit').addEventListener('click', address);


}



	 function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      };

    function showlistings(){
          var bounds = new google.maps.LatLngBounds();

          for(var i = 0; i < markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);    

          };
          map.fitBounds(bounds);
      };

    function hidelistings(){
        for(var i = 0; i < markers.length; i++){
          markers[i].setMap(null);
        };
      };


    function address(){

    	var geocoder = new google.maps.Geocoder();

    	var address = document.getElementById('address').value

    	if (address == ''){
    		window.alert('you must enter an area or address');
    	} else {
    		geocoder.geocode({address: address}, function(results, status){
    				if(status == google.maps.GeocoderStatus.OK){
    					map.setCenter(results[0].geometry.location);
    					map.setZoom(15);
    					document.getElementById('firstComponent').innerHTML="The Formatted Address is:" + results[0].formatted_address; // PUT STUFF HERE
            			document.getElementById('secondComponent').innerHTML="The Location is:" + results[0].geometry.location  // PUT STUFF HERE

    				}else{
    					window.alert('Coudlnt find the location - try entering a more specific places');
    				}

    		});

    	};

    };



















