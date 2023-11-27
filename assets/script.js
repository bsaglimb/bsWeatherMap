var key = '64f2ee2a8261daa4d9f780f5b365f275';
var city = "Miami"

//Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityHistory = [];
//Will save the text value of the search and save it to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnP').siblings('.textValue').val().trim();
	if (city === "") {
		return;
	};
	cityHistory.push(city);

	localStorage.setItem('city', JSON.stringify(cityHistory));
	fiveDayForecastEl.empty();
	getHistory();
	getWeatherToday();
});

//Will create buttons based on search history 
var containerHistoryEl = $('.cityHistory');
function getHistory() {
	containerHistoryEl.empty();

	for (let i = 0; i < cityHistory.length; i++) {

		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHistory[i]}`)

		rowEl.addClass('row historyBtnRow');
		btnEl.addClass('btn btn-outline-secondary historyBtn');
		btnEl.attr('type', 'button');

		containerHistoryEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
    	//Allows the buttons to start a search 
	$('.historyBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayForecastEl.empty();
		getWeatherToday();
	});
};

//Grab the main 'Today' card body.
var bodyToday = $('.bodyToday')
//Applies the weather data to the today card and then launches the five day forecast
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(bodyToday).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.todaysCityName').text(response.name);
		$('.todaysDate').text(date);
		//Icons
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		bodyToday.append(pEl);
		//Humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		bodyToday.append(pElHumid);
		//Wind Speed
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		bodyToday.append(pElWind);
		//Set the lat and long from the searched city
		var cityLon = response.coord.lon;
		// console.log(cityLon);
		var cityLat = response.coord.lat;
		// console.log(cityLat);
        var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			bodyToday.append(pElUvi);
			//set the UV index to match an exposure chart severity based on color 
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};

var fiveDayForecastEl = $('.fiveDayForecast');
function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				wind: value.wind.speed,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
        //Place the cards on the screen 
		for (let i = 0; i < myWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveDayForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			//Wind
			var pElWindSpeed = $('<p>').text(`Wind: ${myWeather[i].wind} MPH`);
			divElBody.append(pElWindSpeed);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};
//Allows for the example data to load for Miami
function initLoad() {

	var cityHistoryStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistoryStore !== null) {
		cityHistory = cityHistoryStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();