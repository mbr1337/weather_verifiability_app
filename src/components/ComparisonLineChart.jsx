import React, {useEffect} from "react";
import axios from "axios";
import {apiUrl} from "../config";
import {addDays, addHours, format} from "date-fns";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function ComparisonLineChart({startDate, lengthInDays, collection}) {

    const [joinedData, setJoinedData] = React.useState(null);
    const [valueToCompare, setValueToCompare] = React.useState('Temperature');


    useEffect(() => {
        handleData();
    }, []);

    async function handleData() {
        try {
            const forecastDataFromRequest = await getForecastDataFromApi(startDate, lengthInDays,  collection)
            const forecastData = forecastDataFromRequest.data.data;

            const historicalDataFromRequest = await getHistoricalWeatherDataFromApi(startDate, lengthInDays)
            const historicalData = historicalDataFromRequest.data.hourly;

            setJoinedData(joinJsons(historicalData, forecastData));

        } catch (error) {
            console.log("handle data error: " + error);
        }
    }


    async function getForecastDataFromApi(startDateString, numDays, collection) {
        const endDateString = getFormattedDateWithAddedTime(startDateString, numDays, 0);
        const url = apiUrl + collection + '?date=' + startDateString + '&endDate=' + endDateString;

        return await axios.get(url);
    }

    async function getHistoricalWeatherDataFromApi(startDateString, numDays) {
        const locationUrlFragment = "latitude=50.01&longitude=20.99";

        const timeZoneHourCorrection = 0;

        const formattedStartDate =  getFormattedDateWithAddedTime(startDateString, 0, timeZoneHourCorrection);
        const formattedEndDate = getFormattedDateWithAddedTime(startDateString, numDays, timeZoneHourCorrection);

        const dateRangeUrlFragment = "&start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;

        const readyUrl = 'https://archive-api.open-meteo.com/v1/archive?'
            + locationUrlFragment + dateRangeUrlFragment + '&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain';
        console.log(readyUrl);
        return await axios.get(readyUrl);

    }

    function getFormattedDateWithAddedTime(startDateString, numDays, numHours){
        const date = new Date(startDateString);
        const dateWithAddedDays = addDays(date, numDays);
        const dateWithAddedHours = addHours(dateWithAddedDays, numHours);

        return format(dateWithAddedHours, 'yyyy-MM-dd');
    }

    function joinJsons(historicalData, forecastData) {
        const result = [];

        // Iterate over the time array of the first JSON
        for (let i = 0; i < historicalData.time.length; i++) {

            // Format time to correct difference between forecast and historical data
            const timeFromJson = historicalData.time[i];
            const dateWithAdjustedTimeZone = addHours(new Date(timeFromJson), 1)
            const time = format(dateWithAdjustedTimeZone, "yyyy-MM-dd'T'HH:mm");

            // Find the corresponding data object in the second JSON
            const matchingData = forecastData.find(data => data.time.slice(0,-3) === time);

            // Create a new object combining the data from both JSONs
            const mergedObject = {
                time:time,

                historicalTemperature:          historicalData.temperature_2m[i],
                historicalApparentTemperature:  historicalData.apparent_temperature[i],
                historicalRain:                 historicalData.rain[i],
                historicalHumidity:             historicalData.relativehumidity_2m[i],

                forecastTemperature:            matchingData ? matchingData.temperature : null,
                forecastApparentTemperature:    matchingData ? matchingData.feelsLike   : null,
                forecastRain:                   matchingData ? matchingData.rain        : null,
                forecastHumidity:               matchingData ? matchingData.humidity    : null,

            };

            result.push(mergedObject);
        }

        return result;
    }



    return (

        <div style={{width: '100%'}}>
            {
                joinedData &&
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={joinedData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="time"/>
                        <YAxis dataKey={'historical'+valueToCompare}/>
                        <Tooltip/>
                        <Legend/>
                        <Line
                            type="monotone"
                            dataKey={'historical'+valueToCompare}
                            name={'Actual '+valueToCompare}
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey={'forecast'+valueToCompare}
                            name={'Predicted '+valueToCompare}
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            }


        </div>
    );

}
