// main.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Google Map
    const mapContainer = document.getElementById('map-container');
    const locationListContainer = document.getElementById('location-list');
    const searchButton = document.getElementById('search-button');
    const locationInput = document.getElementById('location');
    const destinationInput = document.getElementById('destination');
    const proximityInput = document.getElementById('proximity'); // Updated ID for proximity input


    let map;
    let markers = [];
    let locationsData = [];  // Array to store names and locations

    function initMap() {
        map = new google.maps.Map(mapContainer, {
            center: { lat: 0, lng: 0 },
            zoom: 2,
            mapTypeId: 'satellite'
        });

        // Add event listener for map click to clear markers
        map.addListener('click', function () {
            clearMarkers();
        });
    }

    

    // Function to add marker to the map
    function addMarker(location) {
        const marker = new google.maps.Marker({
            position: location,
            map: map
        });

        markers.push(marker);
    }

    // Function to clear markers from the map
    function clearMarkers() {
        markers.forEach(marker => {
            marker.setMap(null);
        });
        markers = [];
    }

    // Function to update the map based on user-selected location
    function updateMap(selectedLocation) {
        clearMarkers();
        const location = new google.maps.LatLng(selectedLocation.location.y, selectedLocation.location.x);
        map.setCenter(location);
        map.setZoom(10);  // Adjust the zoom level as needed
        addMarker(location);
    }


const datalist = document.getElementById('locations');
const destinationDatalist = document.getElementById('destinations');


// Google Maps API Key
const googleMapsApiKey = 'AIzaSyBa4twY7Ccsr0tnFcn34A0RxBH5qLIvCVI'; // Replace with your actual Google Maps API key


let selectedLocationMarker = null;
// Function to show a marker on the map
function showMarkerOnMap(locationData) {
  if (mapContainer) {
    const mapOptions = {
      center: { lat: locationData.location.y, lng: locationData.location.x },
      zoom: 14, // You can adjust the zoom level as needed
      mapTypeId: 'satellite'
    };
    // Create a new map instance
    map = new google.maps.Map(mapContainer, mapOptions);

    // Create a marker on the map
    selectedLocationMarker = new google.maps.Marker({
      position: { lat: locationData.location.y, lng: locationData.location.x },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: '#0000FF',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
      },
      title: locationData.name,
    });

    // You can add additional customization to the marker if needed
  }
}

let proximityCircle = null;

// Function to show a proximity circle on the map
function showProximityCircleOnMap(locationData, proximity) {
    if (mapContainer) {
        console.log
        console.log("Inside the proximity");
      // Convert proximity to meters (assuming it's in miles)
      const radiusInMeters = proximity * 1609.344;
  
      // Create a proximity circle around the selected location
      proximityCircle = new google.maps.Circle({
        map: map,
        center: selectedLocationMarker.getPosition(),
        radius: radiusInMeters,
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.35
      });

      proximityLocationMarker = new google.maps.Marker({
        position: { lat: locationData.location.y, lng: locationData.location.x },
        map: map,
        title: `Proximity to ${locationData.name}`
      });
  
    }
  }

// Fetch JSON data (replace with your actual API endpoint)
fetch('/static/files/all-airbases-response.json')  // Update the file path accordingly
  .then(response => response.json())
  .then(data => {
    // Initialize an empty list to store combined information
    const combinedList = [];

    // Iterate through each entry in the JSON response
    data.forEach(entry => {
      // Extract relevant information and combine into a single object
      const properties = entry._fields[0].properties;
      const combinedEntry = {
        location: properties.location,
        icao: properties.icao,
        name: properties.name
      };

      // Push the combined entry into the list
      combinedList.push(combinedEntry);
    });

    // Check if the data structure is as expected
    if (Array.isArray(combinedList) && combinedList.length > 0) {
      // Populate the datalist for location suggestions
      if (datalist) {
        // Clear existing options
        datalist.innerHTML = '';

        // Add options for each entry in the combined list
        combinedList.forEach(entry => {
          const option = document.createElement('option');
          option.value = entry.name;
          datalist.appendChild(option);
        });

        // Add event listener for location selection
        locationInput.addEventListener('input', (event) => {
          selectedLocation = combinedList.find(entry => entry.name === event.target.value);
          if (selectedLocation) {
            // Show marker on the map
            showMarkerOnMap(selectedLocation);
          }
        });
      }

      // Check if the data structure is as expected
if (Array.isArray(combinedList) && combinedList.length > 0) {
    // Populate the datalist for destination suggestions
    if (destinationDatalist) {
      // Clear existing options
      destinationDatalist.innerHTML = '';
  
      // Add options for each entry in the combined list
      combinedList.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.name;
        destinationDatalist.appendChild(option);
      });
  
      // Add event listener for destination selection
      destinationInput.addEventListener('input', (event) => {
        const selectedDestination = combinedList.find(entry => entry.name === event.target.value);
        if (selectedDestination) {
          // Draw flight path to the selected destination
          openPopupCard(selectedDestination);
          console.log("This is the selected location", selectedLocationMarker)
          drawFlightPath(
            { lat: selectedLocation.location.y, lng: selectedLocation.location.x },
            { lat: selectedDestination.location.y, lng: selectedDestination.location.x }
          );
        }
      });
    }
  }

  // Function to draw a flight path between two locations
function drawFlightPath(origin, destination) {
console.log("Inside flight path");
    const lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 8,
        strokeColor: "#393",
      };

    const flightPath = new google.maps.Polyline({
      path: [origin, destination],
      icons: [
        {
          icon: lineSymbol,
          offset: "100%",
        },
      ],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map,
    });
  
    flightPath.setMap(map);
    animateArrow(flightPath);
    // Set the map to display the flight path
    const bounds = new google.maps.LatLngBounds();
  bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
  bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));

  // Fit the map viewport to the bounding box with padding
  map.fitBounds(bounds, 50); // Adjust padding as needed

  // Create a Marker for the destination
  const destinationMarker = new google.maps.Marker({
    position: destination,
    map: map,
    title: 'Destination',
  });
    
  }

  function animateArrow(line) {
    
    let count = 0;
  
    window.setInterval(() => {
      count = (count + 1) % 200;
  
      const icons = line.get("icons");
  
      icons[0].offset = count / 2 + "%";
      line.set("icons", icons);
    }, 20);
  }



// Add event listener for search button click
if (searchButton) {
    searchButton.addEventListener('click', () => {
      const selectedLocation = combinedList.find(entry => entry.name === locationInput.value);
      const proximity = parseFloat(proximityInput.value);

      if (!isNaN(proximity) && selectedLocation) {
        // Clear existing markers and circles
        if (selectedLocationMarker) {
            
          selectedLocationMarker.setMap(null);
        }
        if (proximityCircle) {
          proximityCircle.setMap(null);
        }

        // Show proximity circle on the map
        showProximityCircleOnMap(selectedLocation, proximity);

        // Get all locations within the proximity circle
        const locationsWithinProximity = getAllLocationsWithinProximity(selectedLocation, proximity);
        

        // Create markers for all locations within the proximity circle
        showMarkersOnMap(selectedLocation,locationsWithinProximity);
      }
    });
  }
  let markers = [];
  //let map = null; // Declare a global map variable

// Function to show markers on the map
function showMarkersOnMap(location,locationsData) {
   
    if (map) {
        // Clear existing markers
        
        clearMarkers();

        // Create a new marker for each location
        locationsData.forEach(locationData => {
            const marker = new google.maps.Marker({
                position: { lat: locationData.location.y, lng: locationData.location.x },
                map: map,
                title: locationData.name
            });

            // Add the marker to the global markers array
            markers.push(marker);
        });

        // Center the map on the first marker
        // showMarkerOnMap(location);
        map.setCenter(markers[0].getPosition());
    }
}

// Function to clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

  // Function to get all locations within the proximity circle
function getAllLocationsWithinProximity(selectedLocation, proximityMiles) {
    
    // Filter locations within the proximity circle
    const locationsWithinProximity = combinedList.filter(location => {
        const distance = calculateDistance(
            selectedLocation.location.y,
            selectedLocation.location.x,
            location.location.y,
            location.location.x
        );

        return distance <= proximityMiles;
    });

    return locationsWithinProximity;
}


    } else {
      console.error('Data structure is not as expected.');
    }
  })
  .catch(error => console.error('Error fetching locations:', error));


    // Initialize Google Maps
    initMap();


    // Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Radius of the Earth in kilometers

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

    // Function to close the popup card
function closePopupCard() {
    const popupCard = document.getElementById('popup-card');
    popupCard.style.display = 'none';
}

    // Function to open the popup card and populate information
function openPopupCard(selectedLocation) {
    const popupCard = document.getElementById('popup-card');
    const titleElement = document.getElementById('popup-card-title');
    const nameElement = document.getElementById('popup-card-name');
    const icaoElement = document.getElementById('popup-card-icao');

    // Populate information
    titleElement.textContent = 'Destination Information';
    nameElement.textContent = selectedLocation.name;
    icaoElement.textContent = selectedLocation.icao;
    // Add more information fields as needed

    // Show the popup card
    popupCard.style.display = 'block';
}



    // // Add event listener for dynamically updating the map when a location is clicked in the list
    // locationListContainer.addEventListener('click', function (event) {
    //     if (event.target.classList.contains('location-item')) {
    //         const selectedLocationName = event.target.textContent;
    //         const selectedLocation = locationsData.find(location => location.name === selectedLocationName);

    //         if (selectedLocation) {
    //             updateMap(selectedLocation);
    //         }
    //     }
    // });
});
