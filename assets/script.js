var key = '64f2ee2a8261daa4d9f780f5b365f275';
var city = "Miami"

//Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityHistory = [];
//Will save the text value of the search and save it to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textValue').val().trim();
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
    	//Allows the buttons to start a search as well
	$('.historyBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayForecastEl.empty();
		getWeatherToday();
	});
};
