export default function initMap(courts) {
    const google = window.google;
  
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 40.7264996, lng: -73.9877832},
      zoom: 11
    });
   
    courts.map((court) => {
      var marker = new google.maps.Marker({
        position: {lat: parseFloat(court.lat), lng: parseFloat(court.long)},
        map: map,
        title: court.name,
        icon: {
          url: 'tennisball.png',
          scaledSize: new google.maps.Size(20, 20),
        }
        });
  
      const infoWindow = new google.maps.InfoWindow({
        content: `${court.name}`,
        maxWidth: 200,
      });
  
      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });
  
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
    })
  }