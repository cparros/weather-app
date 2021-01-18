
//Define Variable for btn and data divs for data that I wish to return
var button = $(".btn");
var currentDataDate = $("<div>");
var currentDataTemp = $("<div>");
var currentDataHumid = $("<div>");
var currentDataWind = $("<div>");
var currentDataHolder = $(".today");
var currentDataUVDiv = $("<div>");
var img = $("<img>");

//Define API key
var apiKey = "0fc4f1a65ec726d23f716b2895e1e1b1";

//Get local storage
var localText = localStorage.getItem('searchText') || []

//create populate function
var populate = function (text) {

  //Clear display divs when populate is run so that information is not stacking
  $("h3").empty();
  $(".today").empty();
  $(".future-list").empty();

//AJAX call to get weather info for current day
  $.ajax({
  url:
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    text +
    "&appid=" +
    apiKey,
  method: "GET",

  //Then define variables and get response for weather latitude longitude temp and weather icon
}).then(function (response) {
  console.log(response)
  var weather = response.weather[0].main;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var temperature = (response.main.temp * (9 / 5) - 459.67).toFixed(0);
  var imgIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"

  //Append the response data to the div
  currentDataDate.append(
    $("<h3>").text("Today- " + dayjs().format("MM-DD-YYYY") + " " + text)
  );
  currentDataTemp
    .append($("<p>"))
    .text("Temperature: " + temperature + "°" + "F");
  currentDataHumid
    .append($("<p>"))
    .text("Humidity: " + response.main.humidity + "%");
  currentDataWind
    .append($("<p>"))
    .text("Wind Speed: " + response.wind.speed + " mph");

  currentDataHolder.append(currentDataDate);
  currentDataHolder.append(currentDataTemp);
  currentDataHolder.append(currentDataHumid);
  currentDataHolder.append(currentDataWind);
  
  //Display the correct image for the weather data returned
  if (weather === "Clear") {
    img.attr("src", imgIcon);
    currentDataDate.append(img);
  }
  if (weather === "Clouds") {
    img.attr("src", imgIcon);
    currentDataDate.append(img);
  }
  if (weather === "Rain") {
    img.attr("src", imgIcon);
    currentDataDate.append(img);
  }
  if (weather === "Partly Sunny") {
    img.attr("src", imgIcon);
    currentDataDate.append(img);
  }

  //AJAX call for next 5 day data
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey,
    method: "GET",
  }).then(function (response) {
    console.log(response)
    // Get UV info and append
    var uVIndex = response.value;
    currentDataUVDiv
      .append($('<p class="indexUV">'))
      .text("UV Index: " + uVIndex);
    currentDataHolder.append(currentDataUVDiv)

    //Depending on UV value display the color as background
    if(uVIndex < 3) {
      console.log('true')
      currentDataUVDiv.attr('id', 'low')
      console.log(currentDataUVDiv.text())
    } 
    if(uVIndex > 2 && uVIndex < 6) {
      console.log('true')
      currentDataUVDiv.attr('id', 'med')
      console.log(currentDataUVDiv.text())
    } 
    if(uVIndex > 6 && uVIndex < 8) {
      console.log('true')
      currentDataUVDiv.attr('id', 'high')
      console.log(currentDataUVDiv.text())
    } 
    if(uVIndex > 8) {
      console.log('true')
      currentDataUVDiv.attr('id', 'dangerous')
      console.log(currentDataUVDiv.text())
    } 

    //AJAX call for 5 day data. (get response index to match NEXT DAY. 3 hour increments of index)
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        text +
        "&appid=" +
        apiKey,
      method: "GET",
    }).then(function (response) {
      var fiveDayInfo = [
        response.list[8],
        response.list[16],
        response.list[24],
        response.list[32],
        response.list[39],
      ];

      //For each day get desired info and Append to divs
      fiveDayInfo.forEach(function (index) {
        var weatherforecast = index.weather[0].main;
        var futureDataDiv = $('<div class="futureText">');
        var forecastImg = $("<img>");
        var date = index.dt_txt;
        var temp = (index.main.temp * (9 / 5) - 459.67).toFixed(0);
        var humid = index.main.humidity;
        var betterDate = date.slice(0, 10);
        var forecastImgIcon = "https://openweathermap.org/img/w/" + index.weather[0].icon + ".png"

        futureDataDiv.append($("<p>").text(betterDate));
        futureDataDiv.append($("<p>").text("Temp: " + temp + "°F"));
        futureDataDiv.append($("<p>").text("Humidity: " + humid));

        //Display Correct weather image
        if (weatherforecast === "Clear") {
          forecastImg.attr("src", forecastImgIcon);
          futureDataDiv.append(forecastImg);
        } else if (weatherforecast === "Clouds") {
          forecastImg.attr("src", forecastImgIcon);
          futureDataDiv.append(forecastImg);
        } else if (weatherforecast === "Rain") {
          forecastImg.attr("src", forecastImgIcon);
          futureDataDiv.append(forecastImg);
        } else if (weatherforecast === "Partly Sunny") {
          forecastImg.attr("src", forecastImgIcon);
          futureDataDiv.append(forecastImg);
        } else {
          return;
        }
        //Append future data to future list div
        $(".future-list").append(futureDataDiv);
      });
    });
  });
});
}

// If local storage is full run populate with saved city text. (for reload)
if(localText !== null){
  console.log(localText)
  var text = localText
  populate(text)
}

//Button press/submit action
function submitAction(e) {
  e.preventDefault();

  $("h3").empty();
  $(".today").empty();
  $(".future-list").empty();
  
  //Get search value
  var text = $(".search-text").val();

  //Set local Storage to search value text
  localStorage.setItem('searchText', text)

  //If text is EMPTY do nothing...I think this block of code is where my error is?
  if (text === "") {
    return;
  } else {

    //Append search items to new card in recent search div
    var origin = $(".cardOne");
    var newCard = $('<div class="card card-body">');
  
    origin.append(newCard);
    newCard.append($('<div class="card-body">').text(text));
    newCard.click(function(){
    populate(text)
    })
    populate(text)
  }
}

//Add button click event
button.click(submitAction);

