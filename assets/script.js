// selectCities()
// reference search city button 
const searchBtn = document.getElementById('search-city');
// reference input element 
const inputEl = document.getElementById('city');

// citiesDropDown() & saveCities()  & selectCities()
// empty array to hold user searched cities
let searchedCities = [];

// selectCities()
// reference select element
const selectEl = document.getElementById('cities');

// api key to use openweathermap
const apiKey = 'fcb0e85d49e8d269381b97be8b5205b9';


// get user city searched and push into searchedCities array
function userCitySearch(event) {

   // prevent refresh of page after button click
   event.preventDefault();

   // get value for searched cities and trim excess spaces
   // cannot use textContent with input element
   let citySearched = inputEl.value.trim();
   // lowercase the city
   citySearched = citySearched.toLowerCase();

   // send city searched to latLon();
   latLon(citySearched);

   // if no city is entered or city already exists in the array, the don't push that city in there
   if (citySearched === null || citySearched === '') {
      alert('Please Enter A City');
   }
   // if the city searched by the user is NOT in the array, then push it
   else if (!searchedCities.includes(citySearched)) {
      searchedCities.push(citySearched);

      // reset selectEl so cities aren't duplicated in dropdown
      selectEl.innerHTML = '<option value="Select a City">Searched Cities</option>';

      // run selectCities() here to add city searched to dropdown
      selectCities();
   }
   // include() returns true if the element is contained in the array, and false if otherwise

   // run saveCities() to save cities to local storage
   saveCities();

   // clear input value
   inputEl.value = '';

   // button out of focus
   event.target.blur();
};
searchBtn.addEventListener('click', userCitySearch);


// get value from dropdown
function selectFormHandler() {

   // save city selected by user
   let selectedCity = selectEl.options[selectEl.selectedIndex].value;

   // send city to latLon()
   latLon(selectedCity);
   
   // reset selected city
   selectEl.selectedIndex = 0;

}
selectEl.addEventListener('change', selectFormHandler);


// convert city searched into lat long with api
function latLon(city) {

   // display city searched 
   let currCity = document.getElementById('curr-city');
   currCity.textContent = capitalize(city);

   // fetch information for city
   let apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&appid=' + apiKey;

   // fetch returns Promise, since it's a slower function, it will run asynchronously 
   fetch(apiUrl)
   .then(function(response) {

      // when the HTTP request status code is something in the 200s, the ok proprty will be true
      if (response.ok) {
         // format response object into json
         // json() method returns another promise, so need another then() the resolve the Promise
         // the callback function displays the data
         response.json().then(function(data) {

            // send data of lat lon of city to getCurrWeather()
            getCurrWeather(data);

         });
      }
      // if the ok property is false, do this
      else {
         alert("Error: City Not Found");
      }
   })
   // api's way of handling network errors
   .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to OpenWeatherMap");
   });
};


// get current uv index and current weather for city searched with api using lat lon
function getCurrWeather(cityData) {
   // save city lat
   let cityLat = cityData[0].lat;
   // save city lon
   let cityLon = cityData[0].lon;

   var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=' + apiKey;

   fetch(apiUrl)
   .then(function(response) {

      if (response.ok) {

         response.json().then(function(data) {

            // send current weather data to currWeather()
            currWeather(data.current);

            // send forecast weather to forecast()
            forecast(data.daily);
         });
      }
      else {
         alert("Error: City Lat and Lon Not Found");
      }
   })
   // api's way of handling network errors
   .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to OpenWeatherMap");
   });
};


// display current date
function currDate() {

   // reference current date element
   let currentDay = document.getElementById('currDate');
   // get current date
   let newDate = moment().format('dddd, MMMM Do, YYYY');
   // display it
   currentDay.textContent = newDate;

}
currDate();


// display current weather information
function currWeather(cityWeather) {

   // reference temp element
   let tempEl = document.getElementById('temp');
   tempEl.textContent = Math.round(cityWeather.temp) + '°F';

   // reference icon element
   let iconEl = document.getElementById('icon');
   iconEl.setAttribute('src','http://openweathermap.org/img/wn/' + cityWeather.weather[0].icon + '@2x.png');

   // reference uv index element
   let uvIndexEl = document.getElementById('uv-index');
   // clear uv index classList
   uvIndexEl.classList = '';
   // add styling classes
   uvIndexEl.classList = 'px-3 rounded';
   uvIndexEl.textContent = cityWeather.uvi;
   // index conditions
   if (0 <= cityWeather.uvi < 3) {
      uvIndexEl.classList.add('uv-low');
   }
   else if (3 <= cityWeather.uvi < 8) {
      uvIndexEl.classList.add('uv-moderate');
   }
   else if (8 <= cityWeather.uvi) {
      uvIndexEl.classList.add('uv-extreme');
   }

   // reference wind element
   let windEl = document.getElementById('wind');
   windEl.textContent = cityWeather.wind_speed + ' mph';

   // reference humidity element
   let humidityEl = document.getElementById('humidity');
   humidityEl.textContent = cityWeather.humidity + '%';
};


// display forecast information
function forecast(cityForecast) {

   // reference forecast container
   const daysEl = document.getElementById('days-container');

   // clear reference container
   daysEl.innerHTML = '';

   // cityForecast comes in as an array of objects 
   // forecast for 5 days includes indexes 1-5
   for (i = 1; i < 6; i++) {

      // create element for each day
      let dayEl = document.createElement('article');
      dayEl.classList = 'days';

      // create date title
      let dateEl = document.createElement('h3');
      dateEl.classList = 'p-0 text-white';
      // get dt unix timestamp
      let dtDate = cityForecast[i].dt;
      // convert timestamp to date
      let dayDate = moment.unix(dtDate).format('MMMM DD, Y');
      // display it
      dateEl.textContent = dayDate;

      // create day title 
      let weekDayEl = document.createElement('h3');

      // convert timestamp to date
      let weekDayDate = moment.unix(dtDate).format('dddd');
      // display it
      weekDayEl.textContent = weekDayDate;

      // create icon container
      let iconContainer = document.createElement('div');
      iconContainer.classList = 'img-container';
      // create icon 
      let dayIcon = document.createElement('img');
      dayIcon.classList = 'icon'
      dayIcon.setAttribute('src','http://openweathermap.org/img/wn/' + cityForecast[i].weather[0].icon + '@2x.png');
      // append img to container
      iconContainer.append(dayIcon);

      // create min temp element
      let dateMinTemp = document.createElement('h3');
      dateMinTemp.classList = 'text-white';
      dateMinTemp.textContent = 'L: '  +  Math.round(cityForecast[i].temp.min) + ' °F';

      // create max temp element
      let dateMaxTemp = document.createElement('h3');
      dateMaxTemp.classList = 'text-white';
      dateMaxTemp.textContent = 'H: '  + Math.round(cityForecast[i].temp.max) + ' °F';

      // create wind temp element
      let dateWind = document.createElement('h3');
      dateWind.textContent = cityForecast[i].wind_speed + ' mph';

      // create humidity temp element
      let dateHumidity = document.createElement('h3');
      dateHumidity.classList = 'day-humidity';
      dateHumidity.textContent = 'Humidity: ' + cityForecast[i].humidity + '%';

      dayEl.append(dateEl, weekDayEl, iconContainer, dateMinTemp, dateMaxTemp, dateWind, dateHumidity);
      daysEl.append(dayEl);
   }
};


// load saved cities from local storage
function loadCities() {

   // load saved cities
   let savedCities = localStorage.getItem('Cities');
   // turn savedCities into array 
   savedCities = JSON.parse(savedCities);

   // if there are no cities saved, do nothing
   if (savedCities === null) {
      return;
   }
   // else if there are cities saved, add them to the searchedCities array
   else {
      searchedCities = savedCities;
   }
}
loadCities();


// get the searchCities and save them to local storage
function saveCities() {

   // save userCities array to local storage
   localStorage.setItem('Cities', JSON.stringify(searchedCities).toLowerCase());

};


// loop through userCities and add generate options for select dropdown
function selectCities() {
    
   for(i = 0; i < searchedCities.length; i++) {

      // create the option element
      let optionEl = document.createElement('option');
      // let the value of the option equal the array element
      optionEl.value = searchedCities[i].toLowerCase();
      // let the text of the option equal the array element
      optionEl.textContent = capitalize(searchedCities[i]);

      // append option element to selectEl
      selectEl.append(optionEl); 
   }
};
selectCities();


// capitalize city to display nicely
function capitalize(city) {

   // for each city entered, check if there's a space 
   // space will be true if there is ' ', and will be false if there isn't
   let space = city.includes(' ');

   // declare variable
   let capitalCity;

   // if the city name is more than one word (if space is true)
   if (space) {

      // split the city name into multiple words and create an array with each word as an element
      let words = city.split(' ');

      // iterate over each word 
      for (let i = 0; i < words.length; i++) {
         // make first letter of each word uppercase, and the rest lowercase
         words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }

      // combine the words
      capitalCity = words.join(' ');

   }
   else { // if city has no spaces and only 1 word

      capitalCity = city[0].toUpperCase() + city.substring(1);

   }

   // return the city name capitalized
   return capitalCity;
};