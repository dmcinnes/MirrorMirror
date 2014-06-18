$(function () {

  var roundVal = function (temp) {
    return Math.round(temp * 10) / 10;
  };

  var kmh2beaufort = function (kmh) {
    var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
    for (var beaufort in speeds) {
      var speed = speeds[beaufort];
      if (speed > kmh) {
        return beaufort;
      }
    }
    return 12;
  };

  var iconTable = {
    '01d':'wi-day-sunny',
    '02d':'wi-day-cloudy',
    '03d':'wi-cloudy',
    '04d':'wi-cloudy-windy',
    '09d':'wi-showers',
    '10d':'wi-rain',
    '11d':'wi-thunderstorm',
    '13d':'wi-snow',
    '50d':'wi-fog',
    '01n':'wi-night-clear',
    '02n':'wi-night-cloudy',
    '03n':'wi-night-cloudy',
    '04n':'wi-night-cloudy',
    '09n':'wi-night-showers',
    '10n':'wi-night-rain',
    '11n':'wi-night-thunderstorm',
    '13n':'wi-night-snow',
    '50n':'wi-night-alt-cloudy-windy'
  };

  var renderWeather = function (json) {
    var temp = roundVal(json.main.temp);
    var temp_min = roundVal(json.main.temp_min);
    var temp_max = roundVal(json.main.temp_max);

    var wind = roundVal(json.wind.speed);

    var iconClass = iconTable[json.weather[0].icon];
    var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
    $('.temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

    var now = new Date();
    var sunrise = new Date(json.sys.sunrise*1000).toTimeString().substring(0,5);
    var sunset = new Date(json.sys.sunset*1000).toTimeString().substring(0,5);

    var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + kmh2beaufort(wind) ;
    var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
    if (json.sys.sunrise*1000 < now && json.sys.sunset*1000 > now) {
      sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
    }

    $('.windsun').updateWithText(windString+' '+sunString, 1000);
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

  (function updateCurrentWeather() {
    if (localStorage.weather) {
      renderWeather(JSON.parse(localStorage.weather));
    } else {
      $.getJSON('http://api.openweathermap.org/data/2.5/weather', weatherParams, function(json, textStatus) {
        localStorage.weather = JSON.stringify(json);
        renderWeather(json);
      });
    }

    setTimeout(function() {
      delete localStorage.weather;
      updateCurrentWeather();
    }, 60000);
  })();

  (function updateWeatherForecast() {
    if (localStorage.forecast) {
      renderForecast(JSON.parse(localStorage.forecast));
    } else {
      $.getJSON('http://api.openweathermap.org/data/2.5/forecast', weatherParams, function(json, textStatus) {
        localStorage.forecast = JSON.stringify(json);
        renderForecast(json);
      });
    }

    setTimeout(function() {
      delete localStorage.forecast;
      updateWeatherForecast();
    }, 60000);
  })();

});
