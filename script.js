
window.onload = function () {
    var w = localStorage.getItem(localStorage.key(localStorage.length - 1));
    var g = $('input').val(w);
    return currentWeather(g),
        $("#error").html("");
};

$(document).ready(function () {
    $("#go").click(function () {
        return currentWeather();
    });
});

var currentWeather = function (city) {
    city = $("#city").val();
    $("#error").empty();
    if (city != "") {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=dea06d3acada1c5bcb9ddd9cc33fa188",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                var curCityData = currentCity(data);
                $("#curCityData").html(curCityData);

                historySearch(city);  //history            

                var latitude = data.coord.lat;   //UV index
                var longtitude = data.coord.lon;
                var API_KEY = 'dea06d3acada1c5bcb9ddd9cc33fa188';
                function getWeather(latitude, longtitude) {
                    $.ajax({
                        url: 'https://api.openweathermap.org/data/2.5/uvi?&dea06d3acada1c5bcb9ddd9cc33fa188',
                        data: {
                            lat: latitude,
                            lon: longtitude,
                            units: 'imperial',
                            APPID: API_KEY
                        },
                        success: function (data) {
                            $("#detail").append(
                                '<li> UV Index: ' + data.value + '</li>');
                        }
                    });
                }
                getWeather(latitude, longtitude);

                function getForecast() {   //5-day forecast   
                    $.ajax({
                        url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + "&units=imperial&cnt=5",
                        data: {
                            APPID: API_KEY
                        },
                        success: function (data) {
                            $("#curForecast").empty();
                            for (var i = 0; i < 5; i++) {
                                var dateForecast = new Date(data.list[i].dt * 1000).toDateString();
                                $("#forecastTitle").html("<h2>5 day weather forecast</h2>");
                                $("#curForecast").append(
                                    '<ul id="' + i + '" class="card">' +
                                    '<li><img src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png"/></li>' +
                                    '<li class="dayF">' + dateForecast + '</li>' +
                                    '<li class="mainF">' + data.list[i].weather[0].main + '</li>' +
                                    '<li> High: <strong>' + data.list[i].temp.max + ' &deg;F</strong></li>' +
                                    '<li> Low: <strong>' + data.list[i].temp.min + ' &deg;F</strong></li>' +
                                    '<li> Humidity: ' + data.list[i].humidity + '%</li>' +
                                    '</ul>');
                            }
                        }
                    });
                }
                getForecast();
            }
        });
    } else if ($(city) === null) {

        $("#error").html("City not found.");
    } else {
        $("#error").html("Please enter a city.");
    }
};

function currentCity(data) {
    var t = new Date(data.dt * 1000);
    return "<h1>" + data.name + '<span class="country"> ,' + data.sys.country + "</span></h1>" +
        "<h4>" + t + "</h4>" +
        '<ul id="look">' +
        '<li>' + data.weather[0].main + '<span> / ' + data.weather[0].description + "</span>" + "</li>" +
        '<li><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png"</li>' +
        '</ul>' +
        '<ul id="detail">' +
        '<li> Temeperature: ' + data.main.temp + " &deg;F</li>" +
        '<li> Humidity: ' + data.main.humidity + " %</li>" +
        '<li> Wind Speed: ' + data.wind.speed + " m/sec </li>" +
        '</ul>';
}

var i = 0;
var count = 0;
var btnI;
var historySearch = function (city) { //search history
    if (count < 10) {
        $("#cityList").append('<li id="' + i + '" ><button type="submit" id="btn' + i + '" class="cityTab"  value= "' + city + '">' + city + '</button><button id="' + i + '" class="remove">X</button></li>');
        localStorage.setItem(i, city);
        btnI = "btn" + i;
        i++;
        return count++;
    } else {
        $("#errorList").html('<p>Delete city to save in history.</p');
        return;
    }
};

var $cityList = $("#cityList");
$cityList.delegate(".remove", "click", function () { //locale storage
    var $li = $(this).closest("li");
    $li.remove();
    var key = $(this).attr("id");
    $("#errorList").empty();
    localStorage.removeItem(key);
    return count--;
});

$cityList.delegate(".cityTab", "click", function () { //locale storage
    var r = this.innerHTML;
    var R = $('input').val(r);
    return currentWeather(R),
        $(this).next().remove(),
        $(this).remove();
});
var w = localStorage.getItem(localStorage.key(localStorage.length - 1));
