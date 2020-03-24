var mainCoord = new google.maps.LatLng(50.464379, 30.519131);
var map;
var directionsService = new google.maps.DirectionsService();

function initialize(home) {
    var html_element = document.getElementById("map");
    map = new google.maps.Map(html_element, {
        center: mainCoord,
        zoom: 9
    });
    setMarker(mainCoord, "assets/images/map-icon.png");
    var home;
    var direction;
    if (home) {
        home = setMarker(home.data, home.icon);
        direction = displayDirection(mainCoord, home.data);
    }
    return {map: map, home: home, direction: direction};
}

function geocodeAddress(address, callback) {
    new google.maps.Geocoder().geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0])
            callback(null, results[0].geometry.location);
        else
            callback(new Error("Unable to find address."));
    });
}

function geocodeLatLng(loc, callback) {
    new google.maps.Geocoder().geocode({'location': loc}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1])
            callback(null, results[1].formatted_address);
        else
            callback(new Error("Unable to find address."));
    });
}

function calculateRoute(A, B, callback) {
    directionsService.route(
        {
            origin: A,
            destination: B,
            travelMode: google.maps.TravelMode["DRIVING"]
        },
        function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var leg = response.routes[0].legs[0];
                callback(null, {
                    duration: leg.duration,
                    address: leg.end_address
                });
            }
            else
                callback(new Error("Unable to find direction."));
        });

    return displayDirection(A, B);
}

function displayDirection(A, B) {
    var direction = new google.maps.DirectionsRenderer();
    direction.setOptions({suppressMarkers: true});
    directionsService.route(
        {
            origin: A,
            destination: B,
            travelMode: google.maps.TravelMode["DRIVING"]
        },
        function (response, status) {
            if (status == google.maps.DirectionsStatus.OK)
                direction.setDirections(response);
        });
    direction.setMap(map);
    return direction;
}

function setMarker(position, icon) {
    return new google.maps.Marker({
        position: position,
        map: map,
        icon: icon
    });
}


exports.mainCoord = mainCoord;
exports.geocodeLatLng = geocodeLatLng;
exports.geocodeAddress = geocodeAddress;
exports.calculateRoute = calculateRoute;
exports.setMarker = setMarker;
exports.initialize = initialize;