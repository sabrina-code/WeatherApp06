
window.onload = function () {
    let w = localStorage.getItem(localStorage.key(localStorage.length - 1));
    let g = $('input').val(w);
    return currentWeather(g),
        $("#error").html("");
};

$(document).ready(function () {
    $("#go").click(function () {
        return currentWeather(),
            $("#city").val('');
    });
});

const currentWeather = function (city) {
    city = $("#city").val();
    $("#error").empty();
    if (city != "") {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=dea06d3acada1c5bcb9ddd9cc33fa188",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                const curCityData = currentCity(data);
                $("#curCityData").html(curCityData);

                historySearch(city);  //history            

                const latitude = data.coord.lat;   //UV index
                const longtitude = data.coord.lon;
                const API_KEY = 'dea06d3acada1c5bcb9ddd9cc33fa188';
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
                                '<li> Peak UV Index: ' + data.value + '</li>');
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
    let t = new Date(data.dt * 1000);
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

let i = 0;
let count = 0;
let btnI;
let historySearch = function (city) { //search history
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

let $cityList = $("#cityList");
$cityList.delegate(".remove", "click", function () { //locale storage
    let $li = $(this).closest("li");
    $li.remove();
    let key = $(this).attr("id");
    $("#errorList").empty();
    localStorage.removeItem(key);
    return count--;
});

$cityList.delegate(".cityTab", "click", function () { //locale storage
    let r = this.innerHTML;
    let R = $('input').val(r);
    return currentWeather(R)
    // $(this).next().remove(),
    // $(this).remove();
});
