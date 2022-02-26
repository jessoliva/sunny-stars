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

    console.log('citiesDropDown beginning ', searchedCities)
    // convert cities

    // prevent refresh of page after button click
    event.preventDefault();

    // get value for searched cities and trim excess spaces
    // cannot use textContent with input element
    let citySearched = inputEl.value.trim();
    // lowercase the city
    citySearched = citySearched.toLowerCase();

    console.log('citiesDropDown before if statements ', searchedCities);

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

// convert city searched into lat long with api
function latLon(city) {

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

            // send data to getCurrWeather()
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
}
latLon('austin');


// get current uv index and current weather for city searched with api
function getCurrWeather(cityData) {

   // save city lat
   let cityLat = cityData[0].lat;
   // save city lon
   let cityLon = cityData[0].lon;

   var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=' + apiKey;

   console.log('uv Index', cityLat, cityLon);

   fetch(apiUrl)
   .then(function(response) {

      if (response.ok) {

         response.json().then(function(data) {

            console.log(data);

            //current
            console.log(data.current.uvi);
            console.log(data.current.temp);
            console.log(data.current.humidity);
            console.log(data.current.wind_speed);

            //next day
            console.log(data.daily)
            console.log(data.daily[0])
            console.log(data.daily[0].temp.min)
            console.log(data.daily[0].temp.max)
            console.log(data.daily[0].uvi)
            console.log(data.daily[0].humidity)
            console.log(data.daily[0].wind_speed)
            console.log(data.daily[0].weather[0].icon)




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
}


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
   console.log('selectCities is ', searchedCities);
    
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
}

