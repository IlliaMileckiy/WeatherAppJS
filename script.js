const inputCity = document.querySelector(".input-city");
const btnSearch = document.querySelector(".btn-search");
const cityName = document.querySelector(".city-name");
const cityTempreture = document.querySelector(".city-tempreture");
const weatherImage = document.querySelector(".weather-image");
const cityHumidity = document.querySelector(".city-humidity");
const cityPrecipitation = document.querySelector(".city-precipitation");
const cityWindSpeed = document.querySelector(".city-windSpeed");

function searchLatLong(inputCityValue) {
    if(inputCityValue.split("/").join("") != inputCityValue) return;
    if(+inputCityValue == 0) return;
    if(inputCityValue == cityName.textContent) return;

    fetch("https://api.api-ninjas.com/v1/city?name=" + inputCityValue, {
        method: 'GET',
        headers: { 'X-Api-Key': 'API-KEY'}
    }).then((data) =>
        data.json())
      .then((data) => {
        if(data.length == 0) {
            cityName.textContent = "Not Found";
            cityTempreture.textContent = "--";
            cityHumidity.textContent = "";
            cityPrecipitation.textContent = "";
            weatherImage.src = "";
            cityWindSpeed.textContent = "";
            return;
        }

        cityName.textContent = data[0].name;
        
        getWeather(data[0].latitude, data[0].longitude);
    });

}

function getWeather(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,rain,snowfall,cloud_cover,wind_speed_10m`)
        .then((data) => data.json())
        .then((data) => {
            const objOfData = data.current;

            let tempreture = +objOfData.temperature_2m;
            let relativeHumidity = +objOfData.relative_humidity_2m;
            let precipitationProbability = +objOfData.precipitation_probability;
            let rain = +objOfData.rain;
            let snowfall = +objOfData.snowfall;
            let cloudCover = +objOfData.cloud_cover;
            let windSpeed = +objOfData.wind_speed_10m;

            cityHumidity.textContent = "Humidity: " + relativeHumidity + " %";
            cityPrecipitation.textContent = "Precipitation: " + precipitationProbability;
            cityTempreture.textContent = `${tempreture}℃`;
            cityWindSpeed.textContent = "Wind: " + windSpeed + "km/h";

            if(cloudCover < 40 && rain == 0 && snowfall == 0 && windSpeed <= 14) {
                weatherImage.src = "./img/sun.png";
            } else if(rain == 0 && snowfall == 0 && windSpeed < 14) {
                weatherImage.src = "./img/sun2.png";
            } else if(rain > 0 && snowfall == 0) {
                weatherImage.src = "./img/rain.png";
            } else if (snowfall > 0) {
                weatherImage.src = "./img/snow.png";
            } else if(snowfall == 0 && rain > 0 && windSpeed < 14 && cloudCover < 55) {
                weatherImage.src = "./img/rainsun.png";
            } else if(snowfall == 0 && rain == 0 && windSpeed >= 14) {
                weatherImage.src = "./img/wind.png";
            } 
        });
}

btnSearch.addEventListener("click", () => {
    searchLatLong(inputCity.value);
});
