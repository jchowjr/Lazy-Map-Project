// Set map options
var myLatLng = { lat: 38.3460, lng: -0.4907 };
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// Create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

// Create a DirectionsService object
var directionsService = new google.maps.DirectionsService();

// Create a DirectionsRenderer object
var directionsDisplay = new google.maps.DirectionsRenderer();

// Geocoder to get specific addresses and coordinates
var geocoder = new google.maps.Geocoder();

// Bind DirectionsRenderer to the map
directionsDisplay.setMap(map);

// Define calcRoute function
function calcRoute() {
    // Get values from input fields
    var origin = document.getElementById("from").value;
    var destination = document.getElementById("to").value;

    // Geocode origin and destination
    geocodeAddress(geocoder, origin, "origin");
    geocodeAddress(geocoder, destination, "destination");

    // Create request for route
    var request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING, // WALKING, BICYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    // Pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // Display distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + origin + ".<br />To: " + destination + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            // Display route on map
            directionsDisplay.setDirections(result);
        } else {
            // Display error if route not found
            directionsDisplay.setDirections({ routes: [] });
            map.setCenter(myLatLng);
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
}

// Geocode function to get specific addresses and coordinates
function geocodeAddress(geocoder, address, type) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            if (type === "origin") {
                console.log("Origin Address: ", results[0].formatted_address); // Full address of origin
                console.log("Origin Coordinates: ", results[0].geometry.location.toString()); // Coordinates
            } else if (type === "destination") {
                console.log("Destination Address: ", results[0].formatted_address); // Full address of destination
                console.log("Destination Coordinates: ", results[0].geometry.location.toString()); // Coordinates
            }
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// Initialize autocomplete
function initAutocomplete() {
    var originInput = document.getElementById("from");
    var destinationInput = document.getElementById("to");

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
}

google.maps.event.addDomListener(window, "load", initAutocomplete);
