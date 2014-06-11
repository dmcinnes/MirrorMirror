jQuery.fn.updateWithText = function(text, speed) {
  var dummy = $('<div/>').html(text);

  if ($(this).html() != dummy.html())
    {
      $(this).fadeOut(speed/2, function() {
        $(this).html(text);
        $(this).fadeIn(speed/2, function() {
          //done
        });
      });
    }
};

jQuery.fn.outerHTML = function(s) {
  return s ? this.before(s).remove()
    : jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp) {
  return Math.round(temp * 10) / 10;
}

function kmh2beaufort(kmh) {
  var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
  for (var beaufort in speeds) {
    var speed = speeds[beaufort];
    if (speed > kmh) {
      return beaufort;
    }
  }
  return 12;
}

jQuery(document).ready(function($) {

  var news = [];
  var newsIndex = 0;

  var eventList = [];

  var lastCompliment;
  var compliment;

  moment.lang(lang);

  //connect do Xbee monitor
  var socket = io.connect('http://rpi-development.local:8080');
  socket.on('dishwasher', function (dishwasherReady) {
    if (dishwasherReady) {
      $('.dishwasher').fadeIn(2000);
      $('.lower-third').fadeOut(2000);
    } else {
      $('.dishwasher').fadeOut(2000);
      $('.lower-third').fadeIn(2000);
    }
  });


  (function updateTime() {
     var now = moment();
     var date = now.format('LLLL').split(' ',4);
     date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

     $('.date').html(date);
     $('.time').html(now.format('HH') + ':' + now.format('mm') + '<span class="sec">'+now.format('ss')+'</span>');

     setTimeout(function() {
       updateTime();
     }, 1000);
   })();


   (function updateCompliment() {
      //see compliments.js
      while (compliment == lastCompliment) {
        compliment = Math.floor(Math.random()*compliments.length);
      }

      $('.compliment').updateWithText(compliments[compliment], 4000);

      lastCompliment = compliment;

      setTimeout(function() {
        updateCompliment(true);
      }, 30000);

    })();

    (function updateCurrentWeather() {
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


       $.getJSON('http://api.openweathermap.org/data/2.5/weather', weatherParams, function(json, textStatus) {
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
       });

       setTimeout(function() {
         updateCurrentWeather();
       }, 60000);
     })();

     (function updateWeatherForecast() {
        $.getJSON('http://api.openweathermap.org/data/2.5/forecast', weatherParams, function(json, textStatus) {

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
        });

        setTimeout(function() {
          updateWeatherForecast();
        }, 60000);
      })();

      (function fetchNews() {
        $.feedToJson({
          feed:'https://news.google.com/news/feeds?pz=1&cf=all&ned=us&hl=en&topic=t&output=rss',
          success: function(data){
            news = [];
            for (var i in data.item) {
              var item = data.item[i];
              news.push(item.title);
            }
          }
        });
        setTimeout(function() {
          fetchNews();
        }, 60000);
      })();

      (function showNews() {
        var newsItem = news[newsIndex];
        $('.news').updateWithText(newsItem,2000);

        newsIndex--;
        if (newsIndex < 0) newsIndex = news.length - 1;
        setTimeout(function() {
          showNews();
        }, 5500);
      })();

});
