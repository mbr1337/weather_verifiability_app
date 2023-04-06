import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentDate } from "../utils/getDates";
import '../styles/weatherStyle.scss';


function MeteoWeather() {
    const meteoWeatherURL = `https://api.open-meteo.com/v1/forecast?latitude=50.01&longitude=20.99&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,snowfall&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe%2FBerlin`;
    const [apparentTemperature_2m, setApparentTemperature_2m] = useState([]);
    const [rain, setRain] = useState([]);
    const [relativehumidity_2m, setRelativeHumidity_2m] = useState([]);
    const [snowfall, setSnowfall] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [time, setTime] = useState([]);


    useEffect(() => {
        axios.get(meteoWeatherURL).then((response) => {
            const hourly = response.data.hourly;
            setApparentTemperature_2m(hourly.apparent_temperature);
            setRain(hourly.rain);
            setRelativeHumidity_2m(hourly.relativehumidity_2m);
            setSnowfall(hourly.snowfall);
            setTemperature(hourly.temperature_2m);
            setTime(hourly.time);
        })
            .catch(error => console.error(error));
    }, []);

    const fullMeteoWeatherInfo = apparentTemperature_2m.map((item, index) => ({
        item1: item,
        item2: rain[index],
        item3: relativehumidity_2m[index],
        item4: snowfall[index],
        item5: temperature[index],
        item6: time[index],
    }));
    return (
        <section id="meteoWeather">
            <h2>Zassane z meteo Weather z daty {getCurrentDate('-', 0)} dla Tarnow</h2>
            <ol>
                {fullMeteoWeatherInfo.map(({ item1, item2, item3, item4, item5, item6 }, index) => (
                    <li key={time[index]}>
                        Temperatura odczuwalna: {item1} - Deszcz: {item2} - Wilgotność: {item3} - Śnieg: {item4} - Temperatura: {item5} - Czas: {item6}
                    </li>
                ))}
            </ol>

        </section>
    );

}

export default MeteoWeather;