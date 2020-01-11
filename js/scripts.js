function inputSearchClick() {
     $('#center-id, #container-id, #conditions-id').toggleClass('opacity');
     $('#center-id, #container-id, #conditions-id').toggleClass('opacity-2');
     $('.search-div').toggleClass('display');
     $('.input-div').toggleClass('display');
}

//what to do when value submitted for zip or city
function submit() {
     let value = $('.search-input').val();
     let valueNoSpace = $('.search-input').val().replace(/\s/g,'');
     if ( /^\d+$/.test(valueNoSpace)) {
          zipCode = valueNoSpace;
          apiWeatherGet(zipCode);
     }
     else {
          let city = value;
          apiCityGet(city);
     }
}

function submitOnEnter(event) {
     event.preventDefault();
     if (event.keyCode === 13) {
          submit();
          inputSearchClick();
     }
}

// get rid of input value when input is clicked
function clearInput() {
     $('input').val(' ');
}

//convert kelvin to fahrenheit
function kToF(k, f) { 
     f = (((k - 273.15) * 9/5 + 32));
     f = Math.round(f*2)/2;
     return f;
}

//applies the appropriate font-awesome depending on whether description
function properIcon(description) {
     (description.match(/sun/gi) !== null) ? $('#description-fa').addClass('fas fa-sun')
          :(description.match(/cloud/gi)  !== null) ? $('#description-fa').addClass('fas fa-cloud')
          :(description.match(/snow/gi) !== null) ? $('#description-fa').addClass('fas fa-snowflake')
          :(description.match(/rain/gi) !== null ) ? $('#description-fa').addClass('fas fa-cloud-rain')
          :(description.match(/mist/gi) !== null ) ? $('#description-fa').addClass('fas fa-cloud')
          :(description.match(/cloud/gi)  !== null && description.match(/sun/gi)  !== null) ? $('#description-fa').addClass('fas fa-cloud-sun')
          :$('#description-fa').addClass('fas fa-sun');
}

//moves marker on temperature bar to the appropriate location
function temperatureBar(fahrenheit) {
     warmColdIds =
          (fahrenheit < 10) ? $('#coldest')
               :(fahrenheit < 30) ? $('#colder')
               :(fahrenheit < 50) ? $('#cold')
               :(fahrenheit < 70) ? $('#mild')
               :(fahrenheit < 83) ? $('#warm')
               :(fahrenheit < 105) ? $('#hot')
               :$('#hottest');
     warmColdIds.addClass('bar');
}

//get zip data from input submit
function apiWeatherGet(zipCode) {
     let apiKey = 'bca4490b7d842fc7c26039b7d7ccfe34';
     let url = 
          'https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?zip=' + zipCode + '&appid=' + apiKey;
     console.log(url);
     fetch((url))
     .then((resp) => {
          return  resp.json();
     })
     .then((jsonData, city) => {
          console.log(jsonData);
          city = jsonData.city.name;
          apiCityGet(city);       
     })
}

//get city data from input submit (if zip submitted this function always runs after apiWeather)
function apiCityGet(city) {
     let apiKey = 'bca4490b7d842fc7c26039b7d7ccfe34';
     let url = 
     'https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
     console.log(url);
     fetch((url))
     .then((res) => {
          return  res.json();
     })
     .then((data) => {
          console.log(data);
          let cityDisplay = data.name;
          let wind = data.wind.speed;
          let windDegrees = data.wind.deg;
          let description = data.weather[0].description;
          let humidity = data.main.humidity;
          let kelvin = data.main.temp;
          let kelvinFeels = data.main.feels_like; 
          let lowKelvin = data.main.temp_min;
          let highKelvin = data.main.temp_max;
          let degrees = '\u00B0';
          let fahrenheit = kToF(kelvin);
          let feelsLike = kToF(kelvinFeels);
          let lowFahrenheit = kToF(lowKelvin);
          let highFahrenheit = kToF(highKelvin);
          let sunriseDate = new Date((data.sys.sunrise + data.timezone) * 1000).toUTCString();
          let sunsetDate = new Date((data.sys.sunset + data.timezone) * 1000).toUTCString();
          let sunrise = sunriseDate.substring(17, 22);
          let sunset = sunsetDate.substring(17, 22);

          let windDirection = 
               (windDegrees > 348.75 && windDegrees <= 11.2) ? "N"
                         : (windDegrees > 11.25 && windDegrees <= 33.75) ? "NNE"
                         : (windDegrees > 33.75 && windDegrees <= 56.25) ? "NE"
                         : (windDegrees > 56.25 && windDegrees <= 78.75) ? "ENE"
                         :  (windDegrees > 78.75 && windDegrees <= 101.25) ? "E"
                         : (windDegrees > 101.25 && windDegrees <= 123.75) ? "ESE"
                         : (windDegrees > 123.75 && windDegrees <= 146.25) ? "SE"
                         : (windDegrees > 146.25 && windDegrees <= 168.75) ? "SSE"
                         : (windDegrees > 168.75 && windDegrees <= 191.25) ? "S"
                         : (windDegrees > 191.25 && windDegrees <= 213.75) ? "SSW"
                         : (windDegrees > 213.75 && windDegrees <= 236.25) ? "SW"
                         : (windDegrees > 236.25 && windDegrees <= 258.75) ? "WSW"
                         : (windDegrees > 258.75 && windDegrees <= 281.25) ? "W"
                         : (windDegrees > 281.25 && windDegrees <= 303.75) ? "WNW"
                         : (windDegrees > 303.75 && windDegrees <= 326.25) ? "NW"
                         : "ESE";

          $('#weather-bar>div').removeClass('bar');
          temperatureBar(fahrenheit);

          $('#description-fa').removeClass();
          properIcon(description);

          console.log(description.match(/rain/gi) !== null);
          $('#city').text(cityDisplay); 
          $('.temp').text(fahrenheit + degrees);
          $('#feel').text('feels like ' + feelsLike + degrees);
          $('#description').text(' ' + description);
          $('.low').text( 'low ' + lowFahrenheit + degrees + ' | high ' + highFahrenheit + degrees);
          $('#humidity').text(' ' + humidity + ' %');
          $('#wind').text(' ' + windDirection + ' ' + wind + ' m/h');
          $('#rise').text(' ' + sunrise + ' am');
          $('#set').text(' ' + sunset + ' pm');
     })
}

//gets the ip of the client which provides the city and then executes apiCityGet
function getIp() {
     let accessKey = 'at_TjkzQysmyA5gxmecbgqlviX69hDXh';
     let url = 'https://geo.ipify.org/api/v1?apiKey=' + accessKey; 
     console.log(url);
     fetch((url))
          .then((res) => {
               console.log(res);
               return  res.json();
          })
          .then((data, city) => {
               console.log(data);
               console.log(data.location.city);
               city = data.location.city;
               apiCityGet(city); 
     })
}

function onReady(){
     getIp();
     $('.search-input').click(clearInput);
     $('.fa-search').click(submit);
     $('.fa-search').click(inputSearchClick);
     document.addEventListener("keyup", submitOnEnter);
     $('#center-id, #container-id, #conditions-id').toggleClass('opacity', false);
     $('#center-id, #container-id, #conditions-id').toggleClass('opacity-2', true);
     $('.search-div').toggleClass('display', false);
     $('.input-div').toggleClass('display', true);
     $('.search-input').attr('value', 'zip or city');
     $('body').css('height', window.innerHeight);
}
$('document').ready(onReady);

