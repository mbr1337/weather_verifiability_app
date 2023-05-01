import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Customized,
    Cross
} from "recharts";
import axios from "axios";
import Papa from "papaparse"
import testcsv from "./prognoza_pogody_z_dnia_2023-04-18_z_Meteo_Weather.csv";
import { format } from "date-fns";

function CombinedLineChart(props) {

    const historicalDataAPI = `https://archive-api.open-meteo.com/v1/archive?latitude=50.01&longitude=20.99&start_date=2023-04-18&end_date=2023-05-01&hourly=temperature_2m,apparent_temperature`;
    const [apparentTemperature_2m, setApparentTemperature_2m] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [time, setTime] = useState([]);
    const [fullHistoricalWeatherInfoArray, setfullHistoricalWeatherInfoArray] = useState([]);
    const [weatherForecasts, setWeatherForecasts] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [combinedWeatherDataInfo, setCombinedWeatherDataInfo] = useState([]);

    useEffect(() => {
        axios
            .get(historicalDataAPI)
            .then((response) => {
                const hourly = response.data.hourly;
                setApparentTemperature_2m(hourly.apparent_temperature);
                setTemperature(hourly.temperature_2m);
                setTime(hourly.time);
            })
            .catch((error) => console.error(error));
    }, [historicalDataAPI]);

    useEffect(() => {

        Papa.parse(testcsv, {
            header: true,
            download: true,
            complete: function (results) {
                setWeatherForecasts(results.data)
            }
        });
    }, []);

    useEffect(() => {
        const fullHistoricalWeatherInfo = apparentTemperature_2m.map((item, index) => {
            const date = new Date(time[index]);
            const formattedDate = format(date, "yyyy-MM-dd");
            return {
                feelsLike: item,
                temperature: temperature[index],
                time2: formattedDate,
            };
        });
        // const fullHistoricalWeatherInfo = apparentTemperature_2m.map((item, index) => {
        //     const date = new Date(time[index]);
        //     const formattedDate = date.toLocaleString("en-US", {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //     }).replace(/\//g, "-").split("-").reverse().join("-");

        //     return {
        //         feelsLike: item,
        //         temperature: temperature[index],
        //         time2: formattedDate,
        //     };
        // });
        setfullHistoricalWeatherInfoArray(fullHistoricalWeatherInfo);
    }, [apparentTemperature_2m, temperature, time]);


    useEffect(() => {
        setWeatherData([...fullHistoricalWeatherInfoArray, ...weatherForecasts]);
    }, [weatherForecasts, apparentTemperature_2m, temperature, time, fullHistoricalWeatherInfoArray])


    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart
                width={500}
                height={300}
                data={weatherData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time2" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="feelsLike" stroke="#8884d8" /> */}
                <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default CombinedLineChart;