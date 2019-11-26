function apiWeatherGet(zipCode, city) {
     let apiKey = 'bca4490b7d842fc7c26039b7d7ccfe34';
     let response = null;
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

function apiCityGet(city) {
     let apiKey = 'bca4490b7d842fc7c26039b7d7ccfe34';
     let response = null;
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
          let kelvinToF = ((kelvin - 273.15) * 9/5 + 32);
          let lowKelvinToF = ((lowKelvin - 273.15) * 9/5 + 32);
          let highKelvinToF = ((highKelvin - 273.15) * 9/5 + 32);
          let degrees = '\u00B0';
          let fahrenheit = Math.round(kelvinToF*2)/2;
          let lowFahrenheit = Math.round(lowKelvinToF*2)/2;
          let highFahrenheit = Math.round(highKelvinToF*2)/2;
          $('.city-name').text('Currently in ' + cityDisplay); 
          $('.fahrenheit').text('it is ' + fahrenheit + degrees + 'F');
          $('.description').text('with ' + description);
          $('.humidity').text('and a humidity level of ' + humidity + '%');
          $('.min-fahrenheit').text('with a low of  ' + lowFahrenheit + degrees + 'F');
          $('.max-fahrenheit').text('and a high of  ' + highFahrenheit + degrees + 'F');
          $('.show-weather').text(fahrenheit + degrees + 'F');
     })
}

function zipSubmit() {
     zipCode = $('#zip').val();
     apiWeatherGet(zipCode);
     $('.temperature').fadeIn().css('opacity', '1');
     $('.show-weather').fadeIn().css('opacity', '1');
}

function citySubmit() {
     city = $('#city').val();
     apiCityGet(city);
     $('.temperature').fadeIn().css('opacity', '1');
     $('.show-weather').fadeIn().css('opacity', '1');
}

function clearZipInput() {
     $('#zip').val(' ');
     $('#city').val(' ');
}

function clearCityInput() {
     $('#city').val(' ');
     $('#zip').val(' ');
}

function onReady(){
     $('#zip-submit').click(zipSubmit);
     $('#city-submit').click(citySubmit); 
     $('#zip').click(clearZipInput);
     $('#city').click(clearCityInput);
     $('body').css('height', window.innerHeight);
}
$('document').ready(onReady);

