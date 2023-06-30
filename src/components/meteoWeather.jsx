import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentDate } from "../utils/getDates";
import '../styles/weatherStyle.scss';
import DownloadData from "./downloadData";
import BChart from "./barChart";
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
import { meteoWeatherURL } from "../config";
function MeteoWeather() {
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
    }, []);

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
    const style = {
        top: 0,
        left: 350,
        lineHeight: "24px"
    };
    return (
        <section id="meteoWeather">
            <h2>Pobrane z <u>Meteo Weather</u> z daty {getCurrentDate('-', 0)} dla Tarnow</h2>
            {/* <table>
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
            </table> */}
            <BChart
                width={1000}
                height={700}
                fullWeatherArray={fullMeteoWeatherInfoArray}
                xDataKey="time2"
                barDataKey1="feelsLike"
                barDataKey2="temperature"
            />
            <DownloadData updatedArray={fullMeteoWeatherInfoArray} from={"Meteo_Weather"} />
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    width={500}
                    height={400}
                    data={fullMeteoWeatherInfoArray}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="time2" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="feelsLike" fill="#1c1c1c" />
                    <Bar dataKey="temperature" barSize={20} fill="#ff7300" fillOpacity={0.5} />
                    <Line type="monotone" dataKey="rain" stroke="#0000ff" />
                </ComposedChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    width={500}
                    height={300}
                    data={fullMeteoWeatherInfoArray}
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
                    <Line type="monotone" dataKey="feelsLike" stroke="#8884d8" />
                    <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </section>
    );

}

export default MeteoWeather;