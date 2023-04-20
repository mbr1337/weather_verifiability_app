import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentDate } from "../utils/getDates";
import '../styles/weatherStyle.scss';
import DownloadData from "./downloadData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function MeteoWeather() {
    const meteoWeatherURL = `https://api.open-meteo.com/v1/forecast?latitude=50.01&longitude=20.99&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth&timezone=Europe%2FBerlin`;
    const [apparentTemperature_2m, setApparentTemperature_2m] = useState([]);
    const [rain, setRain] = useState([]);
    const [relativehumidity_2m, setRelativeHumidity_2m] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [time, setTime] = useState([]);
    const [fullMeteoWeatherInfoArray, setFullMeteoWeatherInfoArray] = useState([]);

    useEffect(() => {
        axios
            .get(meteoWeatherURL)
            .then((response) => {
                const hourly = response.data.hourly;
                setApparentTemperature_2m(hourly.apparent_temperature);
                setRain(hourly.precipitation_probability);
                setRelativeHumidity_2m(hourly.relativehumidity_2m);
                setTemperature(hourly.temperature_2m);
                setTime(hourly.time);
            })
            .catch((error) => console.error(error));
    }, [meteoWeatherURL]);

    useEffect(() => {
        const fullMeteoWeatherInfo = apparentTemperature_2m.map((item, index) => ({
            feelsLike: item,
            rain: rain[index],
            humidity: relativehumidity_2m[index],
            temperature: temperature[index],
            // time2: time[index].substr(0, 10),
            time2: new Date(time[index]).toLocaleString(),
            date:
                // parseInt(
                (time[index].substr(-5))
            // .replace(":","-")
            // )
            ,

        }));
        setFullMeteoWeatherInfoArray(fullMeteoWeatherInfo);
    }, [apparentTemperature_2m, rain, relativehumidity_2m, temperature, time]);

    return (
        <section id="meteoWeather">
            <h2>Zassane z <u>Meteo Weather</u> z daty {getCurrentDate('-', 0)} dla Tarnow</h2>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Czas</th>
                        <th>Temperatura (°C)</th>
                        <th>Odczuwalna (°C)</th>
                        <th>Wilgotność (%)</th>
                        <th>Szansa na opady (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {fullMeteoWeatherInfoArray.map(({ feelsLike, rain, humidity, temperature, time2, date }, index) => (

                        <tr key={time[index]}>
                            <td>{time2.substr(0, 10)}</td>
                            <td>{(date.substr(0, 10))}</td>
                            <td>{temperature}</td>
                            <td>{feelsLike}</td>
                            <td>{humidity}</td>
                            <td>{rain}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DownloadData updatedArray={fullMeteoWeatherInfoArray} from={"Meteo_Weather"} />
            <BarChart
                width={1000}
                height={700}
                data={fullMeteoWeatherInfoArray}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time2" padding={{ left: 30, right: 30 }} />
                <YAxis label="°C" />
                <Tooltip />
                <Legend />
                <Bar dataKey="feelsLike" fill="#8884d8" />
                <Bar dataKey="temperature" fill="#82ca9d" />
                {/* <Bar dataKey="time2" fill="#1c1c1c" /> */}
                {/* {console.log(fullMeteoWeatherInfoArray)} */}
            </BarChart>
        </section>
    );

}

export default MeteoWeather;