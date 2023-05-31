const meteoWeatherURL = `https://api.open-meteo.com/v1/forecast?latitude=50.01&longitude=20.99&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth&timezone=Europe%2FBerlin`;
const weatherApiURL = `http://api.weatherapi.com/v1/forecast.json?key=2d90c55a577d4168a2b171800230604&q=Tarnow&days=7&aqi=no&alerts=no`;
const visualCrossingURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tarnow?unitGroup=us&include=hours&key=WUUB5CLKC97FSMXZ6YK8GF4F6&contentType=json`;

const apiUrl = "http://localhost:3000/forecasts/";
const apiUrlFromGivenDay = "http://localhost:3000/forecasts/{name}?date={date}";
const apiUrlFromRange = "http://localhost:3000/forecasts/{name}?startDate={startDate}&endDate={endDate}";


module.exports = {
    meteoWeatherURL,
    weatherApiURL,
    visualCrossingURL,
    apiUrl,
    apiUrlFromGivenDay,
    apiUrlFromRange,

}
