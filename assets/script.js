// Weather Dashboard Challenge 6 PsuedoCode

// 1. Explore Open Weather API and Documentation\
// 2. Figure out to get an API-Key for Open Weather API (which may involve making an account)
// 3. Create a search box
    // -HTML markup, css
    // API call to run onClick of the search button 
    // Pass the user input into the url of the API call appropriately
// 4. Display the queried city's information on the dashboard for the user to see including forecast
// 5. When we display the city's UV index, we want to display it in a color that matches the number 
// 6. Store the user's search history in local storage
//    -get the user's search history and display it in the search dropdown 
//    -when the user clicks the city from the dropdown, pass the city into the api call to get and display the info from that city again

// HINT: Abstract API call to a function with a city as the parameter to be passed into the url 

// when i create a drop down menu, add the searched for cities into an array, loop through the array to create the option for the drop down menu

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
   

// get current date and time
function currDate() {
   // get current day
   let currentDay = $('#currDate');
   // set format for current day
   currentDay.text(moment().format('dddd, MMMM Do YYYY'));

   // as each second passes, show it dynamically
   setInterval (function() {
      // get current time
      let currentTime = $('#currTime');
      // set format for current time
      currentTime.text(moment().format('h:mm:ss A'));

   }, 1000);
}
currDate();


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
   // source: https://bobbyhadz.com/blog/javascript-array-push-if-not-exist#:~:text=over%20includes()%20.-,To%20push%20an%20element%20in%20an%20array%20if%20it%20doesn,()%20method%20to%20add%20it.

   // run saveCities() to save cities to local storage
   saveCities();

   // clear input value
   inputEl.value = '';
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
// credit: https://stackoverflow.com/questions/46329633/select-value-without-button
// credit https://www.w3schools.com/jsref/event_onchange.asp


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

   // to display correct date
   let addDay = 1;

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
      dateEl.classList = 'day-date p-0';
      let dayDate = moment(moment(), "MMMM Do YYYY").add(addDay, 'days');
      let dateFormat = dayDate.format('MMMM DD, Y');
      dateEl.textContent = dateFormat;
      // inc day
      addDay++;

      // create icon 
      let dayIcon = document.createElement('img');
      dayIcon.setAttribute('src','http://openweathermap.org/img/wn/' + cityForecast[i].weather[0].icon + '@2x.png');

      // create min temp element
      let dateMinTemp = document.createElement('h3');
      dateMinTemp.textContent = 'L: '  +  Math.round(cityForecast[i].temp.min) + ' °F';

      // create max temp element
      let dateMaxTemp = document.createElement('h3');
      dateMaxTemp.textContent = 'H: '  + Math.round(cityForecast[i].temp.max) + ' °F';

      // create wind temp element
      let dateWind = document.createElement('h3');
      dateWind.textContent = cityForecast[i].wind_speed + ' mph';

      // create humidity temp element
      let dateHumidity = document.createElement('h3');
      dateHumidity.classList = 'day-humidity';
      dateHumidity.textContent = 'Humidity: ' + cityForecast[i].humidity + '%';

      dayEl.append(dateEl, dayIcon, dateMinTemp, dateMaxTemp, dateWind, dateHumidity);
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


// NEED TO GIVE CREDIT TO
// https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
// capitalize city to display nicely
function capitalize(city) {
   return city.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
};


