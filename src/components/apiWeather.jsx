import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentDate } from "../utils/getDates";

function ApiWeather() {
    const weatherApiURL = `http://api.weatherapi.com/v1/forecast.json?key=2d90c55a577d4168a2b171800230604&q=Tarnow&days=7&aqi=no&alerts=no`;
    const [feelsLike, setFeelsLike] = useState([]);
    const [rain, setRain] = useState([]);
    const [humidity, setHumidity] = useState([]);
    const [snowfall, setSnowfall] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [time, setTime] = useState([]);
    useEffect(() => {
        axios.get(weatherApiURL).then((response) => {
            console.log(response.data.forecast.forecastday[0].hour);
            // TODO: jutro
            // const hours = response.data.forecast.forecastday[0].hour;
            // setFeelsLike(hours.feelslike_c);
            // setRain(hours.chance_of_rain);
            // setHumidity(hours.humidity);
            // setSnowfall(hours.chance_of_snow);
            // setTemperature(hours.temp_c);
            // setTime(hours.time);
        })
            .catch(error => console.error(error));
    }, []);

    // const fullWeatherApiInfo = feelsLike.map((item, index) => ({
    //     item1: item,
    //     item2: rain[index],
    //     item3: humidity[index],
    //     item4: snowfall[index],
    //     item5: temperature[index],
    //     item6: time[index],
    // }));

    return (
        <section id="weatherApi">
            <h2>Zassane z weather Api z daty {getCurrentDate('-')} dla Tarnow</h2>
            {/* <ol>
                {fullWeatherApiInfo.map(({ item1, item2, item3, item4, item5, item6 }, index) => (
                    <li key={time[index]}>
                        Temperatura odczuwalna: {item1} - Deszcz: {item2} - Wilgotność: {item3} - Śnieg: {item4} - Temperatura: {item5} - Czas: {item6}
                    </li>
                ))}
            </ol> */}
        </section>
    )

}

export default ApiWeather;