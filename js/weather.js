$(function () {

  var getLocation = function () {
    var deferred = jQuery.Deferred();

    navigator.geolocation.getCurrentPosition(
      deferred.resolve, deferred.reject, geoLocationOptions);

    var promise = deferred.promise();
    promise.fail(function (err) {
      console.log('getLocation fail', err);
    });

    return promise;
  };

  var roundVal = function (temp) {
    return Math.round(temp * 10) / 10;
  };

  var iconTable = {
    'clear-day':           'wi-day-sunny',
    'clear-night':         'wi-night-clear',
    'rain':                'wi-rain',
    'snow':                'wi-snow',
    'sleet':               'wi-rain-mix',
    'wind':                'wi-cloudy-gusts',
    'fog':                 'wi-fog',
    'cloudy':              'wi-cloudy',
    'partly-cloudy-day':   'wi-day-cloudy',
    'partly-cloudy-night': 'wi-night-cloudy',
    'hail':                'wi-hail',
    'thunderstorm':        'wi-thunderstorm',
    'tornado':             'wi-tornado'
  };

  var bearingIcons = [
    'wi-wind-north',
    'wi-wind-north-east',
    'wi-wind-east',
    'wi-wind-south-east',
    'wi-wind-south',
    'wi-wind-south-west',
    'wi-wind-west',
    'wi-wind-north-west'
  ];

  var renderWeather = function (currentWeather) {
    var temp = roundVal(currentWeather.temperature);

    var wind = roundVal(currentWeather.windSpeed);

    var iconClass = iconTable[currentWeather.icon];
    var icon = $('<span/>').addClass('icon dimmed wi').addClass(iconClass);
    $('.temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

    var bearingIcon = '';
    var bearing = currentWeather.windBearing;
    if (bearing !== undefined) {
      bearing -= 45;
      if (bearing < 0) {
        bearing += 360;
      }
      var bearingIndex = Math.round(bearing / 45);
      bearingIcon = $('<span/>').addClass('xdimmed wi').addClass(bearingIcons[bearingIndex]);
    }

    var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + ' ' + bearingIcon.outerHTML();
    $('.wind').updateWithText(windString, 1000);
  };

  var renderForecast = function (json) {
    var forecastData = {};

    for (var i in json.list) {
      var forecast = json.list[i];
      var dateKey  = forecast.dt_txt.substring(0, 10);

      if (forecastData[dateKey] === undefined) {
        forecastData[dateKey] = {
          'timestamp':forecast.dt * 1000,
          'temp_min':forecast.main.temp,
          'temp_max':forecast.main.temp
        };
      } else {
        forecastData[dateKey]['temp_min'] = (forecast.main.temp < forecastData[dateKey]['temp_min']) ? forecast.main.temp : forecastData[dateKey]['temp_min'];
        forecastData[dateKey]['temp_max'] = (forecast.main.temp > forecastData[dateKey]['temp_max']) ? forecast.main.temp : forecastData[dateKey]['temp_max'];
      }

    }

    var forecastTable = $('<table />').addClass('forecast-table');
    var opacity = 1;
    for (var i in forecastData) {
      var forecast = forecastData[i];
      var dt = new Date(forecast.timestamp);
      var row = $('<tr />').css('opacity', opacity);

      row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
      row.append($('<td/>').addClass('temp-max').html(roundVal(forecast.temp_max)));
      row.append($('<td/>').addClass('temp-min').html(roundVal(forecast.temp_min)));

      forecastTable.append(row);
      opacity -= 0.155;
    }

    $('.forecast').updateWithText(forecastTable, 1000);
  };

  var getWeatherData = function(lat, long) {
    // use the cached copy if we have it
    if (localStorage.forecast) {
      var deferred = jQuery.Deferred();
      deferred.resolve(JSON.parse(localStorage.forecast));
      return deferred.promise();
    }

    var url = 'https://api.forecast.io/forecast/'+APIKEY+'/'+lat+','+long+'?callback=?';
    var ajax = $.getJSON(url, weatherParams);
    ajax.done(function (weatherData) {
      // cache the response
      localStorage.forecast = JSON.stringify(weatherData);
    });
    return ajax;
  };

  var updateWeather = function () {
    getLocation().then(function (location) {
      var coords = location.coords;
      return getWeatherData(coords.latitude, coords.longitude);
    }).done(function (weatherData) {
      renderWeather(weatherData.currently);
    });
  };

  updateWeather();

  setTimeout(function () {
    // clear the cache
    delete localStorage.forecast;
    updateWeather();
  }, 360000);
});
