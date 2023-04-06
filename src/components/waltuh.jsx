import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/weatherStyle.scss';
import { getCurrentDate, getPreviousWeekDate } from "../utils/getDates";


function Waltuh() {
    const [meteoTimeArray, setMeteoTimeArray] = useState([]);
    const [meteoTemperatureArray, setMeteoTemperatureArray] = useState([]);
    const [weatherApiTimeArray, setWeatherApiTimeArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const today = getCurrentDate('-', 0);
    const previousWeekDate = getPreviousWeekDate('-', 0);
    const previousWeekDateMinusOne = getPreviousWeekDate('-', 1);
    const meteoWeatherURL = `https://archive-api.open-meteo.com/v1/archive?latitude=50.01&longitude=20.99&start_date=${previousWeekDate}&end_date=${previousWeekDate}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;
    const weatherBitURL = `https://api.weatherbit.io/v2.0/history/hourly?lat=50.01&lon=20.99&start_date=${previousWeekDateMinusOne}&end_date=${previousWeekDate}&key=be3b07c2cf8742a992f1c40367ea1348`;
    // https://www.weatherbit.io/history/hourly
    // https://www.weatherbit.io/api
    const weatherApiURL = `http://api.weatherapi.com/v1/history.json?key=2d90c55a577d4168a2b171800230604 &q=Tarnow&dt=${previousWeekDate}`;

    useEffect(() => {
        axios.get(meteoWeatherURL).then((response) => {
            const hourly = response.data.hourly;
            setMeteoTimeArray(hourly.time);
            setMeteoTemperatureArray(hourly.temperature_2m);
            setIsLoading(false);
        })
            .catch(error => console.error(error));
    }, []);

    // useEffect(() => {
    //     axios.get(weatherBitURL).then((response) => {
    //         console.log(response.data);
    //     })
    //         .catch(error => console.error(error));
    // }, []);

    useEffect(() => {
        axios.get(weatherApiURL).then((response) => {
            const hours = response.data.forecast.forecastday[0].hour;
            setWeatherApiTimeArray(hours);
        })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="mainContainer">
            <h1>Dzisiaj mamy: {today}</h1>
            {isLoading ? <p>Loading...</p> : (
                <div>
                    <section id="meteoWeather">
                        <h3>Zassane z meteo Weather z daty {previousWeekDate}</h3>
                        <div className="left">
                            <ol>
                                {meteoTimeArray.map((time, index) => (
                                    <li key={`time-${index}`}>{time}</li>
                                ))}
                            </ol>
                        </div>
                        <div className="right">
                            <ol>
                                {meteoTemperatureArray.map((temp, index) => (
                                    <li key={`temperature-${index}`}>{temp}</li>
                                ))}
                            </ol>
                        </div>
                    </section>
                    <section id="weatherApi">
                        <h3>Zassane z weather Api z daty {previousWeekDate}</h3>
                        <div className="left">
                            <ol>
                                {weatherApiTimeArray.map((hour, index) => (
                                    <li key={`time-${index}`}>{hour.time}</li>
                                ))}
                            </ol>
                        </div>
                        <div className="right">
                            <ol>
                                {weatherApiTimeArray.map((hour, index) => (
                                    <li key={`temperature-${index}`}>{hour.temp_c}</li>
                                ))}
                            </ol>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Waltuh;