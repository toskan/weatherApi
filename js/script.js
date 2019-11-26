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
     $('.temperature').fadeIn().css('opacity', '1');
     $('.max-fahrenheit').text('Loading...');
     fetch((url))
     .then((res) => {
          return  res.json();
     })
     .then((data) => {
          let cityDisplay = data.name;
          let description = data.weather[0].description;
          let humidity = data.main.humidity;
          let kelvin = data.main.temp; 
          let lowKelvin = data.main.temp_min;
          let highKelvin = data.main.temp_max;
          let degrees = '\u00B0';
          let fahrenheit = kToF(kelvin);
          let lowFahrenheit = kToF(lowKelvin);
          let highFahrenheit = kToF(highKelvin);
          $('.city-name').text('Currently in ' + cityDisplay); 
          $('.fahrenheit').text('it is ' + fahrenheit + degrees + 'F');
          $('.description').text('with ' + description);
          $('.humidity').text('and a humidity level of ' + humidity + '%');
          $('.min-fahrenheit').text('with a low of  ' + lowFahrenheit + degrees + 'F');
          $('.max-fahrenheit').text('and a high of  ' + highFahrenheit + degrees + 'F');
          $('.show-weather').text(fahrenheit + degrees + 'F');
     })
}

//getIp only runs once
let getIpClosure = (function() {
     let closure = false;
     return function() {
          if (!closure) {
               closure = true;
               getIp();
          }
     };
})();

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
               $('.temperature').fadeIn().css('opacity', '1');
               $('.show-weather').fadeIn().css('opacity', '1');
     })
}

//what to do when value submitted for zip or city
function submit() {
     let value = $('#city-zip').val();
     let valueNoSpace = $('#city-zip').val().replace(/\s/g,'');
     if ( /^\d+$/.test(valueNoSpace)) {
     zipCode = valueNoSpace;
     apiWeatherGet(zipCode);
     $('.temperature').fadeIn().css('opacity', '1');
     $('.show-weather').fadeIn().css('opacity', '1');
     }
     else {
     let city = value;
     apiCityGet(city);
     $('.temperature').fadeIn().css('opacity', '1');
     $('.show-weather').fadeIn().css('opacity', '1');
     }
}

//get rid of input value when input is clicked
function clearInput() {
     $('#city-zip').val(' ');
}

//convert kelvin to fahrenheit
function kToF(k, f) { 
     f = (((k - 273.15) * 9/5 + 32));
     f = Math.round(f*2)/2;
     return f;
}

function onReady(){
     $('#submit').click(submit);
     $('#city-zip').click(clearInput);
     $('body').css('height', window.innerHeight);
     getIpClosure();
}
$('document').ready(onReady);

