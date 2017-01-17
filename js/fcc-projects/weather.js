$(function() {

  // 1. Place current date in the header
  const dob = new Date(),
        today = { day: dob.getDate(), month: dob.getMonth(), year: dob.getFullYear() };

  $('#current-time')
    .attr('datetime', today.year + '-' + today.month + '-' + today.day)
    .text(dob.toDateString());

  // 2.1. Display data on the current location
  let currentGeoData;
  const elMap = document.getElementById('footer-area'),
        errMsg = 'Unable to fetch location.',
        errMsg2 = 'No data',
        skycons = new Skycons({"color": "rgb(60, 74, 89)"});

  if (Modernizr.geolocation) {
	  elMap.textContent = 'Fetching location...';
    navigator.geolocation.getCurrentPosition(success, fail);
  } else {
    elMap.textContent = errMsg;
  }

  // 2.2. Display additional data in the modal window and the footer
  $('footer .right').on('click', function() {
    const $modalList = $('#ul-info > ul > li'),
          $infoUl = $modalList.children(),
          components = [['lat', '°'], ['long', '°'], ['accuracy', 'm']];

    if (currentGeoData.accuracy === 'N/A') {
      components[2][1] = ' ';
    }

    // Add the geographical information to the span element of each li
    for (let child = 0; child < $infoUl.length; ++child) {
      $($infoUl[child])
        .text(currentGeoData[components[child][0]] + components[child][1])
        .parent().removeClass('init');
    }
  });

  // 2.3. Clone the hourly forecast divs
  for (let i = 0; i < 7; ++i) {
    $hourlyForecast = $('#hour-1').clone();
    $hourlyForecast.attr('id', 'hour-' + (i + 2));
    $('.hourly-forecast').append($hourlyForecast);
  }

  // 2.4. Clone the daily forecast divs
  for (let i = 0; i < 3; ++i) {
    $futureForecast = $('#tomorrow-1').clone();
    $futureForecast.attr('id', 'tomorrow-' + (i + 2));
    $('.future-forecast').append($futureForecast);
  }

  // 3. Display search query weather data
  $('#search-form').on('submit', function(e) {
    e.preventDefault();
    const address = this.elements[0].value,
          geocodeAPI = 'AIzaSyDRxZMD44zoX7gbsvBduP_NxaXCIrPeXS8',
          baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?',
          xhr = new XMLHttpRequest();

    let geocodeURL = baseURL + 'address=' + address + '&key=' + geocodeAPI;
    xhr.onload = function() {
      if (xhr.status === 200) {
        responseObject = JSON.parse(xhr.responseText);

        if (responseObject.status === "OK") {
          currentGeoData = {
            lat: responseObject.results[0].geometry.location.lat,
            long: responseObject.results[0].geometry.location.lng,
            accuracy: 'N/A'
          }
          const queryLocation = responseObject.results[0].formatted_address,
                modalWindowInfo = [currentGeoData.lat, currentGeoData.long, currentGeoData.accuracy];

          // Display new place in current forecast and footer
          $('#current-temp > p').text('Currently at ' + queryLocation);
          elMap.textContent = queryLocation;

          // Fetch and display the forecast data
          displayData(currentGeoData);
        } else { fail(responseObject.status); }
      }
    }
    xhr.open('GET', geocodeURL, true);
    xhr.send(null);
  });

  // 4. Toggle between the imperial and metric system
  $('#units-form label').on('click', function() {
    const type = $(this).context.innerText;
    if (type === 'C') {
      // Switch temperature to celsius
      document.getElementById('radio1').setAttribute('checked', true);
      document.getElementById('radio2').setAttribute('checked', false);
      $('.fahrenheit')
        .html(function(i, txt) {
          return ( Math.round((parseInt(txt, 10) - 32) * 5.0/9.0) + ' &#176;C');
        })
        .removeClass('fahrenheit')
        .addClass('celsius');

      // Switch units of speed to kilometers per hour
      $('.wind-mph')
        .html(function(i, txt) {
          return Math.round((parseInt(txt, 10) * 1.609 ) ) + ' km/h';
        })
        .removeClass('wind-mph')
        .addClass('wind-kmph');
      return;
    } else if (type === 'F') {
      // Switch temperature signs to fahrenheit
      document.getElementById('radio1').setAttribute('checked', false);
      document.getElementById('radio2').setAttribute('checked', true);
      $('.celsius')
        .html(function(i, txt) {
          return ( Math.round((parseInt(txt, 10) * 9.0/5.0) + 32) + ' &#176;F');
        })
        .removeClass('celsius')
        .addClass('fahrenheit');

      // Switch units of speed to miles per hour
      $('.wind-kmph')
        .html(function(i, txt) {
          return Math.round((parseInt(txt, 10) * 0.621)) + ' mph';
        })
        .removeClass('wind-kmph')
        .addClass('wind-mph');
    }
  });

  function displayData(data) {
    const APIKEY = '892f2f3e695745ddcdca40b9c3e5561d',
          LATITUDE = data['lat'],
          LONGITUDE = data['long'],
          UNITS = '?units=si';

    $.ajax({
      url: 'https://api.forecast.io/forecast/' + APIKEY + '/' + LATITUDE + ',' + LONGITUDE + UNITS,
      type: 'GET',
      data: {},
      dataType: 'jsonp',
      timeOut: 2000,
      beforeSend: function(xhr) {
        if (xhr.overrideMimeType) { xhr.overrideMimeType("application/jsonp"); }
        $('.loading').text('Loading...');
      },
      success: function(data) {
        // Current forecast
        $('#current-temp p:last-child')
          .html(data.currently.summary + ', ' + '<span class="celsius">' +
                Math.round(data.currently.temperature) +
                tempUnitSign() + '</span>');
        $('#current-weather-icon').addClass(data.currently.icon);
        const $currentClass = $('#current-weather-icon').attr('class').split(' ');
        skycons.set('current-weather-icon', $currentClass[$currentClass.length-1]);

        // Today's forecast
        $('#today-summary').text(data.daily.data[0].summary);
        $('#today-wind p:nth-child(2)')
          //.addClass('wind-kmph')
          .html(windDirection(data.daily.data[0].windBearing) +
                '<span class="wind-kmph">' +
                Math.round(data.daily.data[0].windSpeed * 3.6) +
                unitSpeed() + '</span>');
        $('#today-humidity p:nth-child(2)')
          .text(data.daily.data[0].humidity * 100 + '%');
        $('#today-sun p:first-child')
          .text('Sunrise: ' + convertUnixTime(data.daily.data[0].sunriseTime), false, false);
        $('#today-sun p:last-child')
          .text('Sunset: ' + convertUnixTime(data.daily.data[0].sunsetTime), false, false);
        $('#today-min-max p:first-child')
          .addClass('celsius')
          .html(Math.round(Math.round(data.daily.data[0].apparentTemperatureMin)) + tempUnitSign());
        $('#today-min-max p:last-child')
          .addClass('celsius')
          .html(Math.round(Math.round(data.daily.data[0].apparentTemperatureMax)) + tempUnitSign());


        // 2.3.1. Modify the class of the hourly forecast
        $('.hourly-forecast > div > p.hourly-1').each(function(index, value) {
          $(this).removeClass('hourly-1').addClass('hourly-' + (index + 1));
        });

        // 2.3.2. Modify the id of the hourly forecast
        $('.hourly-forecast > div > canvas').each(function(index, value) {
          $(this).attr('id', 'to-the-hour-icon' + (index+1));
        });

        // Add data to the hourly forecast
        for (let i = 1; i < 9; ++i) {

          // Add the hourly forecast time
          const $unix_time = data.hourly.data[i].time;
          const $time = convertUnixTime($unix_time, false, false);
          $('.hourly-' + i).text($time);

          // Add the summary and the weather icon
          $('#hour-' + i + ' > p:nth-child(2)').text(data.hourly.data[i].summary);
          $('#hour-' + i + ' canvas').addClass(data.hourly.data[i].icon);
          const $hourClasses = $('#to-the-hour-icon' + i).attr('class').split(' ');
          skycons.set('to-the-hour-icon' + i, $hourClasses[$hourClasses.length-1]);

          // Add the forecast temperature, precipitation and wind speed
          $('#hour-' + i + ' > p:nth-child(4)')
            .addClass('celsius')
            .html(Math.round(data.hourly.data[i].apparentTemperature) + tempUnitSign());
          $('#hour-' + i + ' > div:nth-child(5) canvas').addClass(data.hourly.data[i].precipType);
          $('#hour-' + i + ' > div:nth-child(5) p')
            .text(Math.round(data.hourly.data[i].precipProbability * 100) + '%');
          try {
            $('#hour-' + i + ' > p:nth-child(6)')
              .html(windDirection(data.hourly.data[i].windBearing) +
                    '<span class="wind-kmph">' +
                    Math.round(data.hourly.data[i].windSpeed * 3.6) +
                    unitSpeed() + '</span>');
          } catch(err) {
            $('#hour-' + i + ' > p:nth-child(6)').text(errMsg2)
          }
        }

        // Modify the id of the daily weather icons
        $('.future-forecast > div > div > canvas').each(function(index, value) {
          $(this).attr('id', 'future-weather-icon' + (index+1));
        });

        // Add data to the daily forecast
        for (let i = 1; i < 5; ++i) {
          // Add the day to the header
          const $unix_time = data.daily.data[i].time;
          const $date = convertUnixTime($unix_time, true, false);
          $('#tomorrow-' + i + '> p' ).text($date.substr(0, 3) + ', ' + $date.substr(4, 6));

          // Add the icon and the summary data to the body
          $('#tomorrow-' + i + '> div > canvas').addClass(data.daily.data[i].icon);
          $('#tomorrow-' + i + '> div > p').text(data.daily.data[i].summary);
          const $dailyClasses = $('#future-weather-icon' + i).attr('class').split(' ');
          skycons.set('future-weather-icon' + i, $dailyClasses[$dailyClasses.length-1]);

          // Add the temperature and chance-of-precipitation data to the footer
          $('#tomorrow-' + i + ' div:last-child p.min')
            .addClass('celsius')
            .html(Math.round(data.daily.data[i].apparentTemperatureMin) + tempUnitSign());
          $('#tomorrow-' + i + ' div:last-child p.max')
            .addClass('celsius')
            .html(Math.round(data.daily.data[i].apparentTemperatureMax) + tempUnitSign());
          $('#tomorrow-' + i + ' div:last-child > div > img')
            .addClass(data.daily.data[i].precipType);
          $('#tomorrow-' + i + ' div:last-child > div > p')
            .removeClass('celsius')
            .text(Math.round(data.daily.data[i].precipProbability * 100) + '%');
        }
        skycons.play();
      },
      fail: function() {
        $('.loading').text("Failed");
        $('#current-temp > p').text("Failed to fetch info");
        elMap.textContent = 'Fetch failed...';
      },
      error: function(err) {
        $('.loading').text("Refresh");
        $('#current-temp > p').text("An unknown error occurred");
        elMap.textContent = 'Error while fetching...';
      }
    });
  }

  function success(position) {
    const geoData = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          GEOCODE_KEY = "AIzaSyDRxZMD44zoX7gbsvBduP_NxaXCIrPeXS8",
          baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
          jsonGeo = baseUrl + geoData.lat + ',' + geoData.long + '&key=' + GEOCODE_KEY,
          xhr = new XMLHttpRequest();

    xhr.onload = function() {
      if (xhr.status === 200) {
        responseObject = JSON.parse(xhr.responseText);

        if (responseObject.status === "OK") {
          const address = responseObject.results[0].address_components,
                city = address[address.length - 3].long_name,
                country = address[address.length - 2].long_name;
          elMap.textContent = city + ', ' + country;
          $('#current-temp > p').append(city + ', ' + country);
          displayData(geoData);
          currentGeoData = geoData;
        } else {
          fail(responseObject.status);
        }
      }
    }
    xhr.open('GET', jsonGeo, true);
    xhr.send(null);
  }

  function fail(msg) {
    elMap.textContent = errMsg;
    $('#current-temp .loading').css('line-height', '2rem');
    $('#current-temp .loading').css('margin-left', '-10rem');
    $('.loading').text(errMsg2);
    console.log(msg);
    if (msg === "ZERO_RESULTS") {
      $('.loading').text("No results");
      $('#current-temp > p').text("Zero results");
      $('#current-temp .loading').css('margin-left', '-3rem');
      $('#current-temp .loading').css('margin-left', '0rem'); // Fix display issue
    } else if (msg === "OVER_QUERY_LIMIT") {
      if (!Date.now) {
        Date.now = function now() {
          return new Date().getTime();
        }
      }
      const hours = convertUnixTime(Date.now()/1000, false, true);
      const quota = 'Daily quota limit reached. Quota reset in ';
      $('#current-temp .loading').text(quota + hours + '.');
      $('#current-temp > p').text("Daily quota reached.");
    } else if (msg === "REQUEST_DENIED") {
      $('#current-temp .loading').text("This request has been denied. Please query a new request.");
      $('#current-temp > p').text("Request denied");
    } else if (msg === "INVALID_REQUEST") {
      $('#current-temp .loading').text("Query is missing. Please enter an address, components of an address or a latitude, longitude in the search box.");
      $('#current-temp > p').text("Invalid request");
    } else if (msg === "UNKNOWN_ERROR") {
      $('#current-temp .loading').text("An unknown error has occurred. Please try again later.");
      $('#current-temp > p').text("Unknown error");
    }
  }

  function convertUnixTime(unix_time, dateStr, timeTillMidnight) {
    const date = new Date(unix_time * 1000),
          hours = date.getHours(),
          minutes = "0" + date.getMinutes();
    if (dateStr) {
      return date.toDateString();
    } else if (timeTillMidnight) {
      return (24 - hours) + 'h' + (60 - minutes.substr(-2));
    } else {
      return hours + 'h' + minutes.substr(-2);
    }
  }

  function tempUnitSign() {
    return document.getElementById('radio1').checked ? ' &#176;C' : ' &#176;F';
  }

  function unitSpeed() {
    return document.getElementById('radio1').checked ? ' km/h' : ' mph';
  }

  function windDirection(direction) {
    if (direction >= 348.75) return 'N ';
    else if (direction >= 326.25) return 'NNW ';
    else if (direction >= 303.75) return 'NW ';
    else if (direction >= 281.25) return 'WNW ';
    else if (direction >= 258.75) return 'W ';
    else if (direction >= 236.25) return 'WSW ';
    else if (direction >= 213.75) return 'SW ';
    else if (direction >= 191.25) return 'SSW ';
    else if (direction >= 168.75) return 'S ';
    else if (direction >= 146.25) return 'SSE ';
    else if (direction >= 123.75) return 'SE ';
    else if (direction >= 101.25) return 'ESE ';
    else if (direction >= 78.75) return 'E ';
    else if (direction >= 56.25) return 'ENE ';
    else if (direction >= 33.75) return 'NE ';
    else if (direction >= 11.25) return 'NNE ';
    else if (direction >= 0) return 'N ';
  }
});
