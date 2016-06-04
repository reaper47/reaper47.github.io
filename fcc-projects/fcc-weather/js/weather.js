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
    
  // 2.1. Display current location data
  const elMap = document.getElementById('footer-area'),
        errMsg = 'Unable to fetch location.',
        errMsg2 = 'No data',
        skycons = new Skycons({"color": "rgb(60, 74, 89)"});
        
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(success, fail);
    elMap.textContent = 'Fetching location...';
  } else {
    elMap.textContent = errMsg;
  }
  
  // 2.2. Display additional data in the modal window
  let currentGeoData;
  $('footer .right').on('click', function() {
    const $modalList = $('#ul-info > ul > li');
    
    if ($modalList.children().text().length === 0) {
      const $infoUl = $modalList.children(),
            components = [['lat', '°'], ['long', '°'], ['accuracy', 'm']];
                      
      // Add the geographical information to the span element of each li
      for (let child = 0; child < $infoUl.length; ++child) {
        $($infoUl[child])
          .text(currentGeoData[components[child][0]] + components[child][1])
          .parent().removeClass('init');
      }
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
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType("application/jsonp");
        }
        $('.loading').text('Loading...');
      },
      complete: function() {
        //$('.loading').remove();
      },
      success: function(data) {
        // Current forecast
        $('#current-temp p:last-child')
          .html(data.currently.summary + ', ' + '<span class="celsius">' + 
                Math.round(data.currently.temperature) + 
                tempUnitSign() + '</span>');
        $('#current-weather-icon').addClass(data.currently.icon);
        const $currentClass = $('#current-weather-icon').attr('class').split(' ');
        skycons.set('current-weather-icon', $currentClass[$currentClass.length-1])
        
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
          .text('Sunrise: ' + convertUnixTime(data.daily.data[0].sunriseTime), false);
        $('#today-sun p:last-child')
          .text('Sunset: ' + convertUnixTime(data.daily.data[0].sunsetTime), false);
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

        // 2.3.3. Modify the id of the hourly precipiation forecast
        $('.hourly-forecast > div > div > canvas').each(function(index, value) {
          $(this).attr('id', 'hourly-icon' + (index+1));
        });
        
        // Add data to the hourly forecast
        for (let i = 1; i < 9; ++i) {
         
          // Add the hourly forecast time
          const $unix_time = data.hourly.data[i].time;
          const $time = convertUnixTime($unix_time, false);
          $('.hourly-' + i).text($time);
          
          // Add the summary and the weather icon
          $('#hour-' + i + ' > p:nth-child(2)').text(data.hourly.data[i].summary);
          $('#hour-' + i + ' canvas').addClass(data.hourly.data[i].icon);
          const $hourClasses = $('#to-the-hour-icon' + i).attr('class').split(' ');
          skycons.set('to-the-hour-icon' + i, $hourClasses[$hourClasses.length-1]);
          skycons.set('hourly-icon' + i, "rain");
          
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
        
        // 2.3.3. Modify the id of the daily precipitation forecast
        $('.future-forecast > div > div > div > canvas').each(function(index, value) {
          $(this).attr('id', 'daily-precip-icon' + (index+1));
        });
        
        // Add data to the daily forecast
        for (let i = 1; i < 5; ++i) {
          // Add the day to the header
          const $unix_time = data.daily.data[i].time;
          const $date = convertUnixTime($unix_time, true);
          $('#tomorrow-' + i + '> p' ).text($date.substr(0, 3) + ', ' + $date.substr(4, 6));
          
          // Add the icon and the summary data to the body
          $('#tomorrow-' + i + '> div > canvas').addClass(data.daily.data[i].icon);
          $('#tomorrow-' + i + '> div > p').text(data.daily.data[i].summary);
          const $dailyClasses = $('#future-weather-icon' + i).attr('class').split(' ');
          skycons.set('daily-precip-icon' + i, "rain");
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
        console.log(data);
      },
      fail: function() {
        $('body').html('<div id="fail-load">Failed</div>');
      },
      error: function(err) {
        alert('shit');
      }
    });
  }
  
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

        if (responseObject.status !== "ZERO_RESULTS") {
          const address = responseObject.results[0].address_components,
                city = address[address.length - 3].long_name,
                country = address[address.length - 2].long_name;
          elMap.textContent = city + ', ' + country;
          $('#current-temp > p').append(city + ', ' + country);
          displayData(geoData);
          currentGeoData = geoData;
        } else {
          fail(errMsg);
        }
      }
    }
    xhr.open('GET', jsonGeo, true);
    xhr.send(null);
  }

  function fail(msg) { 
    elMap.textContent = errMsg;
  }
  
  function convertUnixTime(unix_time, dateStr) {
    const date = new Date(unix_time * 1000),
          hours = date.getHours(),
          minutes = "0" + date.getMinutes();
    if (dateStr) {
      return date.toDateString();
    } else {
      return hours + 'h'+ minutes.substr(-2);
    }
  }
  
  function tempUnitSign() {
    return document.getElementById('radio1').checked ? ' &#176;C' : ' &#176;F';
  }
  
  function unitSpeed() {
    return document.getElementById('radio1').checked ? ' km/h' : ' mph';
  }
  
  function windDirection(direction) {
    if (direction >= 348.75) {
      return 'N ';
    } else if (direction >= 326.25) {
      return 'NNW ';   
    } else if (direction >= 303.75) {
      return 'NW ';
    } else if (direction >= 281.25) {
      return 'WNW ';
    } else if (direction >= 258.75) {
      return 'W ';
    } else if (direction >= 236.25) {
      return 'WSW ';
    } else if (direction >= 213.75) {
      return 'SW ';
    } else if (direction >= 191.25) {
      return 'SSW ';
    } else if (direction >= 168.75) {
      return 'S ';
    } else if (direction >= 146.25) {
      return 'SSE ';
    } else if (direction >= 123.75) {
      return 'SE ';
    } else if (direction >= 101.25) {
      return 'ESE ';
    } else if (direction >= 78.75) {
      return 'E ';
    } else if (direction >= 56.25) {
      return 'ENE ';
    } else if (direction >= 33.75) {
      return 'NE ';
    } else if (direction >= 11.25) {
      return 'NNE ';
    } else if (direction >= 0) {
      return 'N ';
    }
  }
});
