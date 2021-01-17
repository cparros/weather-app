var button = $('.btn')
var currentDataDate = $('<div>')
var currentDataTemp = $('<div>')
var currentDataHumid = $('<div>')
var currentDataWind = $('<div>')
var currentDataHolder = $('.today')
var currentDataUVDiv = $('<div>')
var img = $('<img>')

    
button.click(function(e) {
  e.preventDefault()

  $('h3').empty()
  $('.today').empty()
  $('.future-list').empty()
  var text = $('.search-text').val()

  if(text === ''){
    return
  } else {
  var origin = $('.cardOne')
  var newCard = $('<div class="card">')
  var apiKey = "0fc4f1a65ec726d23f716b2895e1e1b1"

  origin.append(newCard)
  newCard.append($('<div class="card-body">').text(text))
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + text + "&appid=" + apiKey,
    method: 'GET'
  }).then(function(response) {
    var weather = response.weather[0].main
    console.log(weather)
    var lat = response.coord.lat
    var lon = response.coord.lon
    var temperature = ((response.main.temp * (9/5)) - 459.67).toFixed(0)
      
    currentDataDate.append($('<h3>').text('Today- ' + dayjs().format("MM-DD-YYYY") + ' ' + text))
    currentDataTemp.append($('<p>')).text('Temperature: ' + temperature +'°' + 'F')
    currentDataHumid.append($('<p>')).text('Humidity: ' + response.main.humidity + '%')
    currentDataWind.append($('<p>')).text('Wind Speed: ' + response.wind.deg + 'mph')
    // currentDataUVDiv.append($('<p>')).text('UV Index: ' + uVIndex)
    
    currentDataHolder.append(currentDataDate)
    currentDataHolder.append(currentDataTemp)
    currentDataHolder.append(currentDataHumid)
    currentDataHolder.append(currentDataWind)
    // currentDataHolder.append(currentDataUVDiv)

    if(weather === "Clear"){
      img.attr('src', './images/sunny.png')
      currentDataDate.append(img)
    } 
    if(weather === "Clouds"){
      img.attr('src', './images/cloudy.png')
      currentDataDate.append(img)
    } 
    if(weather === "Rain"){
      img.attr('src', './images/rain.png')
      currentDataDate.append(img)
    }
    if(weather === "Partly Sunny"){
      img.attr('src', './images/partlySunny.png')
      currentDataDate.append(img)
    }
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey,
      method: 'GET'
    }).then(function(response) {
      var uVIndex = response.value
      currentDataUVDiv.append($('<p class="indexUV">')).text('UV Index: ' + uVIndex)
      currentDataHolder.append(currentDataUVDiv)

      $.ajax({           
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + text + "&appid=" + apiKey,
        method: 'GET'
      }).then(function(response) {
        var fiveDayInfo = [response.list[8],response.list[16],response.list[24],response.list[32],response.list[39]]
        console.log(fiveDayInfo)
        

        fiveDayInfo.forEach(function(index) {
          var weatherforecast = index.weather[0].main
          console.log(weatherforecast)
          var futureDataDiv = $('<div class="futureText">')

          if(weatherforecast === "Clear"){
            img.attr('src', './images/sunny.png')
            futureDataDiv.append(img)
          } else if(weatherforecast === "Clouds"){
            img.attr('src', './images/cloudy.png')
            futureDataDiv.append(img)
          } else if(weatherforecast === "Rain"){
            img.attr('src', './images/rain.png')
            futureDataDiv.append(img)
          } else if (weatherforecast === "Partly Sunny"){
            img.attr('src', './images/partlySunny.png')
            futureDataDiv.append(img)
          } else {
            return
          }

          var date = index.dt_txt
          var temp = (index.main.temp * (9/5) - 459.67).toFixed(0)
          var humid = index.main.humidity
          var betterDate = date.slice(0,10)
          
          futureDataDiv.append($('<p>').text(betterDate))
          futureDataDiv.append($('<p>').text(temp))
          futureDataDiv.append($('<p>').text(humid))

          if(weatherforecast === "Clear"){
            img.attr('src', './images/sunny.png')
            futureDataDiv.append(img)
          } else if(weatherforecast === "Clouds"){
            img.attr('src', './images/cloudy.png')
            futureDataDiv.append(img)
          } else if(weatherforecast === "Rain"){
            img.attr('src', './images/rain.png')
            futureDataDiv.append(img)
          } else if (weatherforecast === "Partly Sunny"){
            img.attr('src', './images/partlySunny.png')
            futureDataDiv.append(img)
          } else {
            return
          }

          $('.future-list').append(futureDataDiv)
          
        })
      })
    })

    
    
  })
  
  }
  
})