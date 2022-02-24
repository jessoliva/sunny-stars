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

// get user city searched and push into searchedCities array
function citiesDropDown(event) {

    // prevent refresh of page after button click
    event.preventDefault();

    // get value for searched cities
    // cannot use textContent with input element
    let citySearched = inputEl.value;
    // lowercase the city
    citySearched = citySearched.toLowerCase();

    // push value searched into userCities array
    searchedCities.push(citySearched);

    // run selectCities() to display searched cities in select dropdown
    selectCities();

    // run saveCities() to save cities to local storage
    saveCities();
};
searchBtn.addEventListener('click', citiesDropDown);

// get the searchCities and save them to local storage
// save the cities searched
function saveCities() {

    console.log('savedCities ', searchedCities);

    // save userCities array to local storage
    localStorage.setItem('Cities', JSON.stringify(searchedCities));

};

// loop through userCities and add generate options for select dropdown
function selectCities() {

    for(i = 0; i < searchedCities.length; i++) {

        // capitalize each city
        searchedCities[i] = capitalize(searchedCities[i]);

        // create the option element
        let optionEl = document.createElement('option');
        // let the value of the option equal the array element
        optionEl.value = searchedCities[i].toLowerCase();
        // let the text of the option equal the array element
        optionEl.textContent = searchedCities[i];

        // append option element to selectEl
        selectEl.append(optionEl); 
    }
};

// NEED TO GIVE CREDIT TO
// https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
// capitalize city to display nicely
function capitalize(city) {
    return city.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase());
}

