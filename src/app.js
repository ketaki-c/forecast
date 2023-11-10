function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day}, ${hours}:${minutes}`;
  }
  
  function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    let day = days[date.getDay()];
    return `${day}`;
  }
  
  function displayForecast(response) {
    console.log(response.data.daily);
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row text-center">`;
    forecast.forEach(function (forecastDay, index) {
      if (index < 5) {
        // Extract the weather icon code from the API response
        let weatherIconCode = forecastDay.weather[0].icon;
  
        // Dynamically generate the icon URL using the code
        let iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
  
        forecastHTML += `  
          <div class="col">
            <ul>
              <li class="day">${formatForecastDay(forecastDay.dt)}</li>
              <li class="icon">
                <img src="${iconUrl}" alt="" id="day-icon" />
              </li>
              <li class="temp-high">${Math.round(forecastDay.temp.max)}°</li>
              <li class="temp-low">${Math.round(forecastDay.temp.min)}°</li>
            </ul>
          </div>`;
      }
    });
    forecastHTML += `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }
      
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;

  
  function getForecast(coordinates) {
    let apiKey = "t6c776a3e39270dbf4ae49o0e62fd0ee";
    let units = "imperial";
    let lat = coordinates.lat;
    let lon = coordinates.lon;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayForecast);
  }
  
  function retrieveCurrentData(response) {
    fahrenheitTemp = response.data.main.temp;
    document.querySelector("#temperature").innerHTML = Math.round(fahrenheitTemp);
    document.querySelector("#city").innerHTML = response.data.name;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#feels-like").innerHTML = Math.round(response.data.main.feels_like);
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#date").innerHTML = formatDate(response.data.dt * 1000);
    document.querySelector("#icon").setAttribute("src", `https://openweathermap.org/img/wn/10d@2x.png`);
    document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);
    document.querySelector("#icon").setAttribute("class", "float-left");
    document.querySelector("#city-input").value = null;
  
    getForecast(response.data.coord);
  }
  
  function search(city) {
    let apiKey = "t6c776a3e39270dbf4ae49o0e62fd0ee";
    let units = "imperial";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(retrieveCurrentData);
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    let cityInputText = document.querySelector("#city-input").value;
    if (cityInputText.trim()) {
      search(cityInputText);
    } else {
      document.querySelector("#city").innerHTML = "Unknown Location";
      document.querySelector("#temperature").innerHTML = null;
      document.querySelector("#description").innerHTML = null;
      document.querySelector("#feels-like").innerHTML = null;
      document.querySelector("#humidity").innerHTML = null;
      document.querySelector("#wind").innerHTML = null;
      document.querySelector("#icon").setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D");
      document.querySelector("#icon").setAttribute("class", "spinner-border");
      document.querySelector("#icon").setAttribute("alt", " ");
      let forecastElement = document.querySelector("#forecast");
      let forecastHTML = `<div class="row text-center"><div class="col">No data available</div></div>`;
      forecastElement.innerHTML = forecastHTML;
      alert("Please enter a location");
    }
  }
  
  function retrieveGpsLocation(response) {
    let apiKey = "t6c776a3e39270dbf4ae49o0e62fd0ee";
    let units = "imperial";
    let lat = response.coords.latitude;
    let lon = response.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(retrieveCurrentData);
  }
  
  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(retrieveGpsLocation);
  }
  
  let form = document.querySelector("#search-form");
  form.addEventListener("submit", handleSubmit);
  
  let button = document.querySelector("#current-button");
  button.addEventListener("click", getCurrentPosition);
  
  search("New York");
  