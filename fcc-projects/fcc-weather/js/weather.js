/*
User Story: I can see the weather in my current location.
User Story: I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
User Story: I can push a button to toggle between Fahrenheit and Celsius.
We recommend using the Open Weather API. This will require creating a free API key.
*/

$(function() {
  // 1. Place the current date in the header
  const dob = new Date(),
        today = { day: dob.getDate(), month: dob.getMonth(), year: dob.getFullYear() };
        
  $('#current-time')
    .attr('datetime', today.year + '-' + today.month + '-' + today.day)
    .text(dob.toDateString());
    
  // 2. Display current location data
  const elMap = document.getElementById('footer-area'),
        errMsg = 'Unable to fetch location.';
        
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(success, fail);
    elMap.textContent = 'Fetching location...';
  } else {
    elMap.textContent = errMsg;
  }
  
  // 3. Display search query weather data
  
  
  function displayData(data) {
    
  }
  
  function success(position) {
    const geoData = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
            altitude: position.coords.altitude
          },
          GEOCODE_KEY = "AIzaSyDRxZMD44zoX7gbsvBduP_NxaXCIrPeXS8",
          baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
          jsonGeo = baseUrl + geoData.lat + ',' + geoData.long + '&key=' + GEOCODE_KEY,
          xhr = new XMLHttpRequest();
     
    xhr.onload = function() {
      if (xhr.status === 200) {
        responseObject = JSON.parse(xhr.responseText); 
        
        if (responseObject.status !== "ZERO_RESULTS") {
          const address = responseObject.results[0].address_components,
                city = address[address.length - 3].long_name,
                country = address[address.length - 2].long_name;
          elMap.textContent = city + ', ' + country;
          displayData(geoData);
        } else {
          fail(errMsg);
        }
      }
    }
    xhr.open('GET', jsonGeo, true);
    xhr.send(null);
  }
  
  function fail(msg) { elMap.textContent = errMsg; }
});
