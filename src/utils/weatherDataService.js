import {getFormattedDateWithAddedTime} from "./getDates";
import axios from "axios";
import {apiUrl} from "../config";
import {addHours, format, isEqual, parseISO} from "date-fns";

export async function getHistoricalWeatherDataFromApi(startDateString, numDays) {
    const locationUrlFragment = "latitude=50.01&longitude=20.99";

    const timeZoneHourCorrection = 0;

    const formattedStartDate = getFormattedDateWithAddedTime(startDateString, 0, timeZoneHourCorrection);
    const formattedEndDate = getFormattedDateWithAddedTime(startDateString, numDays, timeZoneHourCorrection);

    const dateRangeUrlFragment = "&start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;

    const readyUrl = 'https://archive-api.open-meteo.com/v1/archive?'
        + locationUrlFragment + dateRangeUrlFragment + '&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain';
    console.log(readyUrl);
    return await axios.get(readyUrl);

}


export async function getForecastDataFromApi(startDateString, numDays, collection) {
    const endDateString = getFormattedDateWithAddedTime(startDateString, numDays, 0);
    const url = apiUrl + collection + '?date=' + startDateString + '&endDate=' + endDateString;

    return await axios.get(url);
}

export function compareDates(date1, date2) {
    const parsedDate1 = parseISO(date1);
    const parsedDate2 = parseISO(date2);
    return isEqual(parsedDate1, parsedDate2);
}

export function joinJsons(historicalData, forecastData) {
    const result = [];

    // Iterate over the time array of the first JSON
    for (let i = 0; i < historicalData.time.length; i++) {

        // Format time to correct difference between forecast and historical data
        const timeFromJson = historicalData.time[i];
        const dateWithAdjustedTimeZone = addHours(new Date(timeFromJson), 1)
        const time = format(dateWithAdjustedTimeZone, "yyyy-MM-dd'T'HH:mm");


        // Find the corresponding data object in the second JSON
        const rawMatchingData = forecastData.find(data =>{
            return compareDates(data.forecast.time, time);
        });

        if(!rawMatchingData){
            continue;
        }

        const matchingData = rawMatchingData.forecast;

        // Create a new object combining the data from both JSONs
        const mergedObject = {
            time:time,

            historicalTemperature:          historicalData.temperature_2m[i],
            historicalApparentTemperature:  historicalData.apparent_temperature[i],
            historicalRain:                 historicalData.rain[i],
            historicalHumidity:             historicalData.relativehumidity_2m[i],

            forecastTemperature:            matchingData ? matchingData.temperature     : null,
            forecastApparentTemperature:    matchingData ? matchingData.feelsLike       : null,
            forecastRain:                   matchingData ? matchingData.rain            : null,
            forecastHumidity:               matchingData ? matchingData.humidity        : null,

            forecastSource:                 matchingData ? matchingData.forecastSource  : null
        };

        result.push(mergedObject);
    }

    return result;
}
