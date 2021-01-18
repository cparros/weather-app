

var button = $(".btn");
var currentDataDate = $("<div>");
var currentDataTemp = $("<div>");
var currentDataHumid = $("<div>");
var currentDataWind = $("<div>");
var currentDataHolder = $(".today");
var currentDataUVDiv = $("<div>");
var img = $("<img>");
var apiKey = "0fc4f1a65ec726d23f716b2895e1e1b1";
var localText = localStorage.getItem('searchText') || []

var populate = function (text) {
  $("h3").empty();
  $(".today").empty();
  $(".future-list").empty();

  $.ajax({
  url:
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    text +
    "&appid=" +
    apiKey,
  method: "GET",
}).then(function (response) {
  var weather = response.weather[0].main;
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  var temperature = (response.main.temp * (9 / 5) - 459.67).toFixed(0);
  var imgIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"

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
    .text("Wind Speed: " + response.wind.deg + "mph");

  currentDataHolder.append(currentDataDate);
  currentDataHolder.append(currentDataTemp);
  currentDataHolder.append(currentDataHumid);
  currentDataHolder.append(currentDataWind);
  
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
  $.ajax({
    url:
      "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey,
    method: "GET",
  }).then(function (response) {
    console.log(response)
    var uVIndex = response.value;
    currentDataUVDiv
      .append($('<p class="indexUV">'))
      .text("UV Index: " + uVIndex);
    currentDataHolder.append(currentDataUVDiv)
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
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
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
        $(".future-list").append(futureDataDiv);
      });
    });
  });
});
}

if(localText !== null){
  console.log(localText)
  var text = localText
  populate(text)
}

function submitAction(e) {
  e.preventDefault();

  $("h3").empty();
  $(".today").empty();
  $(".future-list").empty();
  
  var text = $(".search-text").val();

  localStorage.setItem('searchText', text)

  if (text === "") {
    return;
  } else {
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
button.click(submitAction);

