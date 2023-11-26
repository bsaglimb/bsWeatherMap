var key = '64f2ee2a8261daa4d9f780f5b365f275';
var city = "Miami"

//Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityList = [];
//Will save the text value of the search and save it to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityList.push(city);

	localStorage.setItem('city', JSON.stringify(cityList));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});