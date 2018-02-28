//Assigning variables
var markers = [];
var map;
var FS_URL = 'https://api.foursquare.com/v2/venues/search';
var clientID = '322YK1NCTFEZMVE4DP542QSV13UM3JCEXTIS3MMBBLTVGAVN';
var clientSecret = 'XDG3FOKADQQH53LCC1YVJMLBYFCNXVEHPRV1K5OCONCB2MLE';


// main viewmodel function
var ViewModel = function(){

      initMap();

      var self = this;      

      
      var largeInfowindow = new google.maps.InfoWindow();
      showMarker(favlocations);
      console.log(markers);
      //saves input from text field to be used in filter 
      this.searchOption = ko.observable('');

      //activating marker on selected location in search
      this.setLocation = function(clickedLocation){
      // highlighting location marker on list click
        ////////code here
        console.log(clickedLocation);
       populateInfoWindow([clickedLocation]);                  
      };

      this.populateAndBounceMarker= function(clickedLocation){
        console.log(clickedLocation);
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };


      //dynamically update the fav location list based input search bar
      this.favLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < markers.length; i++) {
            var markerLocation = markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                markers[i].setVisible(true);      
            } else {
                markers[i].setVisible(false);
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
          zoom: 13,
          mapTypeControl: false,
          styles: styles
        }); 
}

//function to make marker
function makeMarker(favlocations){
          
          console.log(favlocations);

          for(var i = 0; i < favlocations.length; i++){

              this.position = {lat: favlocations[i].lat, lng:  favlocations[i].lng};
              this.lat = favlocations[i].lat;
              this.lng = favlocations[i].lng;
              this.title = favlocations[i].title;

              this.marker = new google.maps.Marker({
              position: this.position,
              title: this.title,
              animation: google.maps.Animation.DROP,
              lat: this.lat,
              lng: this.lng,
              id: i   
              });

          console.log(this.marker);
          //this.marker.setMap(map);

          // Push the marker to our array of markers.
          markers.push(this.marker);
          console.log(markers,'amrkers');
        

          this.marker.addListener('click', self.populateAndBounceMarker);

          };
}

//function to show marker
function showMarker(favlocations) {
             
              
        makeMarker(favlocations);     

        var bounds = new google.maps.LatLngBounds();

        // Extend the boundaries of the map for each marker and display the marker
        for (var j = 0; j < markers.length; j++) {
          markers[j].setMap(map);
       
          bounds.extend(markers[j].position);
        }

        //list item location  click infowindow view
      }


// function to pull info from foursqaure and populate the infowindow
function populateInfoWindow(marker, infowindow) {
        //   Check to make sure the infowindow is not already opened on this marker.
        
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
            
            if (typeof response != 'undefined'){
                self.name = response.name;
                self.address = response.location.formattedAddress[0];
                self.city =    response.location.formattedAddress[1];
                self.country = response.location.formattedAddress[2];
                self.contact = response.contact.formattedPhone;
                
                
                infowindowHTML = '<h1>' + self.name + '</h2><p>' + self.address + '</p><p>'+  
                                  self.city +'</p><p>' + self.country + '</p><p>' + self.contact +'</p>';          
                infowindow.setContent(infowindowHTML);
              }
        }).fail(function(){
          alert('There was an issue with the foursqaure API. Please try again');
        });
        infowindow.open(map, marker); 
      }


function googleError() {
    alert('Google Maps has failed to load. Please check your internet connection or try again later.');
}

function runApp(){
  ko.applyBindings(new ViewModel());
}






