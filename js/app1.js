var favlocations = [
    {
      title: 'Park Ave Penthouse',
      lat: 40.7713024, 
      lng: -73.9632393,
    },

    {
      title: 'Chelsea Loft',
      lat: 40.7444883, 
      lng: -73.9949465,
    },
    {
      title: 'Union Square Open Floor Plan',
      lat: 40.7347062,
      lng: -73.9895759,
    },
    {
      title: 'East Village Hip Studio', 
      lat: 40.7281777, 
      lng: -73.984377,
    },
    {
      title: 'TriBeCa Artsy Bachelor Pad',
      lat: 40.7195264, 
      lng: -74.0089934,
    },
    {
      title: 'Chinatown Homey Space',
      lat: 40.7180628,
      lng: -73.9961237,
    }

]


var Locations = function(data){

    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;

};


var markers = [];
var map;

FS_URL = 'https://api.foursquare.com/v2/venues/search';
clientID = '322YK1NCTFEZMVE4DP542QSV13UM3JCEXTIS3MMBBLTVGAVN';
clientSecret = 'XDG3FOKADQQH53LCC1YVJMLBYFCNXVEHPRV1K5OCONCB2MLE';


function initMap(){
    // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 12,
          mapTypeControl: false
        }); 

};


var ViewModel = function(){

      initMap();
      showListings();

      //this.currentLocation = ko.observable(new locations());

      var self = this;

      this.searchOption = ko.observable('');

      //initiaiing an array for the lcoationlist
      this.locationlist = ko.observableArray([]);

      //assinging location/object to the location list
      favlocations.forEach(function(location){
          self.locationlist.push(new Locations(location));
      });

      //assiging current location
      this.currentLocation = ko.observable(this.locationlist());

      //fav location list and marker functionality
      this.setLocation = function(clickedLocation){
        self.currentLocation(clickedLocation);
       
        
        //make marker
        var bounds = new google.maps.LatLngBounds();
        var position = {lat: clickedLocation.lat, lng:  clickedLocation.lng};

          //var position = locationlist[i].lat;
        var title = clickedLocation.title;

        var largeInfowindow = new google.maps.InfoWindow();

          // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP
          });
          marker.setMap(map);
          bounds.extend(marker.position)
          map.fitBounds(bounds);
          map.setZoom(13);

          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
      };


      //searchbar filter
       this.myLocationsFilter = ko.computed(function() {
        var result = [];
       
        for (var i = 0; i < markers.length; i++) {
            var markerLocation = markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);      
            } 
        }
        return result;
    }, this);  
  };


function makeMarker(){

         for (var i = 0; i < favlocations.length; i++) {
          // Get the position from the location array.
          var position = {lat: favlocations[i].lat, lng:  favlocations[i].lng};
          //var position = locationlist[i].lat;
          var title = favlocations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
              position: position,
              title: title,
              animation: google.maps.Animation.DROP,
              lat: favlocations[i].lat,
              lng: favlocations[i].lng,
              id: i, 
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          var largeInfowindow = new google.maps.InfoWindow();
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          //return markers;
        };
};


function showListings() {

        makeMarker()
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      };



function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
        title = marker.title;
        infowindow.marker = marker;   
      
        var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + 
                      lat + ',' + lng + '&client_id=' + clientID 
                + '&client_secret=' + clientSecret + '&v=20180131' +'&query=' + title;
        
       $.getJSON(apiUrl, function(data){
            response = data.response.venues[0];

            if (typeof response != 'undefined'){
                self.name = response.name;
                self.address = response.location.formattedAddress[0];
                self.city =    response.location.formattedAddress[1];
                self.country = response.location.formattedAddress[2];
                self.contact = response.contact.formattedPhone;
                
                infowindowHTML = '<h1>' + self.name + '</h2><p>' + self.address + '</p><p>'+  
                                  self.city +'</p><p>' + self.country + '</p><p>' + self.contact +'</p>';          
                infowindow.setContent(infowindowHTML);
              }else{
                infowindow.setContent('<div>' + marker.title + '</div>');
              };
        });
        infowindow.open(map, marker); 
      };

function runApp(){
  ko.applyBindings(new ViewModel());
}













