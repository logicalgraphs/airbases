// main.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Google Map
    const mapContainer = document.getElementById('map-container');
    const locationListContainer = document.getElementById('location-list');
    const searchButton = document.getElementById('search-button');
    const locationInput = document.getElementById('location');
    const destinationInput = document.getElementById('destination');
    const proximityInput = document.getElementById('proximity'); // Updated ID for proximity input

    const advancedSearchText = document.getElementById('advanced-search-text');
    const advancedOptions = document.getElementById('advanced-options');

    if (advancedSearchText && advancedOptions) {
        advancedSearchText.addEventListener('click', function () {
            advancedOptions.style.display = (advancedOptions.style.display === 'none') ? 'block' : 'none';
        });
    }

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

        marker.addListener('click', () => {
            openPopupCard(location);
            // Optionally, you can add more logic or actions when a marker is clicked
        });
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
        const location = new google.maps.LatLng(selectedLocation.latitude, selectedLocation.longitude);
        map.setCenter(location);
        map.setZoom(10);  // Adjust the zoom level as needed
        addMarker(location);
    }

const datalist = document.getElementById('locations');
const destinationDatalist = document.getElementById('destinations');


// Google Maps API Key
const googleMapsApiKey = 'noone'; // Replace with your actual Google Maps API key


let selectedLocationMarker = null;

// Function to show a marker on the map
function showMarkerOnMap(locationData) {
    console.log("Selected Location",locationData.longitude);
  if (mapContainer) {
    const mapOptions = {
      center: { lat: locationData.latitude, lng: locationData.longitude },
      zoom: 14, // You can adjust the zoom level as needed
      mapTypeId: 'satellite'
    };
    // Create a new map instance
    map = new google.maps.Map(mapContainer, mapOptions);

    // Create a marker on the map
    selectedLocationMarker = new google.maps.Marker({
      position: { lat: locationData.latitude, lng: locationData.longitude },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: '#0000FF',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
      },
      title: locationData.base,
    });

    selectedLocationMarker.addListener('click', () => {
        openPopupCard(locationData);
        // Optionally, you can add more logic or actions when a marker is clicked
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
        position: { lat: locationData.latitude, lng: locationData.longitude },
        map: map,
        title: `Proximity to ${locationData.base}`
      });
  
    }
  }

// Fetch JSON data (replace with your actual API endpoint)
fetch('/static/files/combined_data_airbases.json')  // Update the file path accordingly
  .then(response => response.json())
  .then(data => {
    // Initialize an empty list to store combined information
    const combinedList = [];

    // Iterate through each entry in the JSON response
    data.forEach(entry => {
        const fields = entry._fields;
        
        const combinedEntry = {
          continent: entry.continent,
          country: entry.country,
          country_code: entry.country_code,
          base: entry.base,
          icao: entry.icao,
          fuel: entry.fuel,
          longitude: entry.longitude,
          latitude: entry.latitude,
          url: entry.url,
          alliances: entry.alliances
        };

      // Push the combined entry into the list
      combinedList.push(combinedEntry);
    });

    // Check if the data structure is as expected
    if (Array.isArray(combinedList) && combinedList.length > 0) {
      console.log("This is inside list",combinedList.length);
      // Populate the datalist for location suggestions
      if (datalist) {
        // Clear existing options
        datalist.innerHTML = '';

        // Add options for each entry in the combined list
        combinedList.forEach(entry => {
          const option = document.createElement('option');
          option.value = entry.base;
          datalist.appendChild(option);
        });

        // Add event listener for location selection
        locationInput.addEventListener('input', (event) => {
          selectedLocation = combinedList.find(entry => entry.base === event.target.value);
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
        option.value = entry.base;
        destinationDatalist.appendChild(option);
      });
  
      // Add event listener for destination selection
      destinationInput.addEventListener('input', (event) => {
        const selectedDestination = combinedList.find(entry => entry.base === event.target.value);
        if (selectedDestination) {
          // Draw flight path to the selected destination
          openPopupCard(selectedDestination);
          console.log("This is the selected location", selectedLocationMarker)
          drawFlightPath(
            { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
            { lat: selectedDestination.latitude, lng: selectedDestination.longitude },selectedDestination
          );
        }
      });
    }
  }

  // Function to draw a flight path between two locations
function drawFlightPath(origin, destination, destinationData) {
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

  //Creating Marker for the origin
  selectedLocationMarker = new google.maps.Marker({
    position: origin,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: '#0000FF',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 1,
    },
    title: selectedLocation.base,
  });

  // Create a Marker for the destination
  const destinationMarker = new google.maps.Marker({
    position: destination,
    map: map,
    title: destination.base,
  });

  destinationMarker.addListener('click', () => { openPopupCard(destinationData);});
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

      const selectedLocation = combinedList.find(entry => entry.base === locationInput.value);
      const proximity = parseFloat(proximityInput.value);

      const desiredFuel = parseFloat(document.getElementById('fuel-requested').value);

      const advancedOptions = document.getElementById('advanced-options');
      if(advancedOptions.style.display !== 'block'){

        console.log("We are always inside",advancedOptions.style.display);

        if (!isNaN(desiredFuel)) {
          // Find the nearest location based on fuel availability
          const nearestLocation = findNearestLocationAndShowMarker(desiredFuel);
    
          if (nearestLocation) {
              console.log('Nearest Location:', nearestLocation);
            // Clear existing markers and circles
            clearMarkers();
            if (proximityCircle) {
              proximityCircle.setMap(null);
            }
  
            drawFlightPath(
              { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
              { lat: nearestLocation.latitude, lng: nearestLocation.longitude },nearestLocation
            );
          }
      }
    }
    else{
        console.log("Advance search");
          showProximityCircleOnMap(selectedLocation, proximity);
          const locationsWithinProximity = getAllLocationsWithinProximity(selectedLocation, proximity);
          showMarkersOnMap(selectedLocation, locationsWithinProximity);
        
  }
    });
  }
  let markers = [];

function showMarkersOnMap(location,locationsData) {
   
    if (map) {
        clearMarkers();

        // Create a new marker for each location
        locationsData.forEach(locationData => {
            const marker = new google.maps.Marker({
                position: { lat: locationData.latitude, lng: locationData.longitude },
                map: map,
                title: locationData.base
            });

            // Add the marker to the global markers array
            markers.push(marker);

            // Add click event listener
        marker.addListener('click', () => {
            openPopupCard(locationData);
            // Optionally, you can add more logic ... blah-blah-blah.
        });
        });

        // Center the map on the first marker
        // showMarkerOnMap(location);
        map.setCenter(markers[0].getPosition());
    }
}

function findNearestLocationAndShowMarker(desiredFuel) {
    let nearestLocation = null;
    let minDistance = Number.MAX_VALUE;
  
    combinedList.forEach(location => {
        if (location !== selectedLocation) {
      const distance = calculateDistance(selectedLocation.latitude, selectedLocation.longitude, location.latitude, location.longitude);
  
      // Check if the location has the desired fuel quantity and is closer than the current nearest location
      if (location.fuel >= desiredFuel && distance < minDistance) {
        nearestLocation = location;
        minDistance = distance;
      }
    }
    });
  
    if (nearestLocation) {
      // Assuming you have a global 'map' object and a function 'showMarkerOnMap'
      showMarkerOnMap(nearestLocation);
    }
  
    return nearestLocation;
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
            selectedLocation.latitude,
            selectedLocation.longitude,
            location.latitude,
            location.longitude
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
    const countryElement = document.getElementById('popup-card-country');
    const continentElement = document.getElementById('popup-card-continent');
    const icaoElement = document.getElementById('popup-card-icao');
    const fuelElement = document.getElementById('popup-card-fuel');
    const urlElement = document.getElementById('popup-card-url');
    const allaincesElement = document.getElementById('popup-card-alliances');

    // Populate information
    titleElement.textContent = 'Air Base Information';
    nameElement.textContent = selectedLocation.base;
    countryElement.textContent = selectedLocation.country;
    continentElement.textContent = selectedLocation.continent;
    icaoElement.textContent = selectedLocation.icao;
    fuelElement.textContent = selectedLocation.fuel;
    urlElement.innerHTML = `<a href="${selectedLocation.url}" target="_blank" rel="noopener noreferrer">${selectedLocation.url}</a>`;
    allaincesElement.textContent = selectedLocation.alliances;

    // Add more information fields as needed

    // Show the popup card
    popupCard.style.display = 'block';
}
});
