//Assigning variables
var markers = [];
var map;

var FS_URL = 'https://api.foursquare.com/v2/venues/search';
var clientID = '322YK1NCTFEZMVE4DP542QSV13UM3JCEXTIS3MMBBLTVGAVN';
var clientSecret = 'XDG3FOKADQQH53LCC1YVJMLBYFCNXVEHPRV1K5OCONCB2MLE';


// main viewmodel function
var ViewModel = function(){

      initMap();
      showMarker(favlocations);

      //saves input from text field to be used in filter 
      this.searchOption = ko.observable('');

      //activating marker on selected location in search
      this.setLocation = function(clickedLocation){
      // highlighting location marker on list click             
        showMarker([clickedLocation]);                  
      };

      //dynamically update the fav location list based input search bar
      this.favLocationsFilter = ko.computed(function() {
        var result = [];
       
        for (var i = 0; i < favlocations.length; i++) {
            var markerLocationTitle = favlocations[i].title;
            if (markerLocationTitle.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                var markerLoc = 
                        { title: favlocations[i].title,
                          lat: favlocations[i].lat, 
                          lng: favlocations[i].lng };
  
                result.push(markerLoc);      
            } 
        }
        return result;
    }, this);  
  };

//function to initialize map
function initMap(){
    // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 12,
          mapTypeControl: false,
          styles: styles
        }); 
}

//function to make marker
function makeMarker(favlocations){

          //defining variables
          this.position = {lat: favlocations.lat, lng:  favlocations.lng};
          this.lat = favlocations.lat;
          this.lng = favlocations.lng;
         
          this.title = favlocations.title;
          
          this.marker = new google.maps.Marker({
              position: position,
              title: title,
              animation: google.maps.Animation.DROP,
              lat: favlocations.lat,
              lng: favlocations.lng,
               
          });

          // Push the marker to our array of markers.
          this.markers.push(this.marker);

          var largeInfowindow = new google.maps.InfoWindow();

          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        //}
}

//function to show marker
function showMarker(location) {
        
        //make marker for the location
        for (var i = 0; i < location.length; i++){
          makeMarker(location[i]);
        }
        //creating bounds
        var bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var j = 0; j < markers.length; j++) {
          markers[j].setMap(map);
          bounds.extend(markers[j].position);
        }
        map.fitBounds(bounds);
      }


// function to pull info from foursqaure and populate the infowindow
function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        console.log(marker, 'marker');
        position = marker.position;
        lat = marker.lat;
        lng = marker.lng;
        title = marker.title;
        infowindow.marker = marker;   
      
        var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + 
                      lat + ',' + lng + '&client_id=' + clientID +
                      '&client_secret=' + clientSecret + '&v=20180212' +'&query=' + title;
        
       $.getJSON(apiUrl, function(data){
            response = data.response.venues[0];
            console.log(response);
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
              }
        });
        infowindow.open(map, marker); 
      }

function runApp(){
  ko.applyBindings(new ViewModel());
}











