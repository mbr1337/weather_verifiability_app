import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/weatherStyle.scss';
import { getCurrentDate, getPreviousWeekDate } from "../utils/getDates";


function Waltuh() {
    const [timeArray, setTimeArray] = useState([]);
    const [temperatureArray, setTemperatureArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const today = getCurrentDate('-',0);
    const previousWeekDate = getPreviousWeekDate('-',0);
    const previousWeekDateMinusOne = getPreviousWeekDate('-',1);
    const meteoWeatherURL = `https://archive-api.open-meteo.com/v1/archive?latitude=50.01&longitude=20.99&start_date=${previousWeekDate}&end_date=${previousWeekDate}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;
    const weatherBitURL = `https://api.weatherbit.io/v2.0/history/hourly?lat=50.01&lon=20.99&start_date=${previousWeekDateMinusOne}&end_date=${previousWeekDate}&key=be3b07c2cf8742a992f1c40367ea1348`;
    // https://www.weatherbit.io/history/hourly
    // https://www.weatherbit.io/api
    useEffect(() => {
        axios.get(meteoWeatherURL).then((response) => {
            const hourly = response.data.hourly;
            setTimeArray(hourly.time);
            setTemperatureArray(hourly.temperature_2m);
            setIsLoading(false);
        })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        axios.get(weatherBitURL).then((response) => {
            console.log(response.data);
        })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="mainContainer">
            <h1>Dzisiaj mamy: {today}</h1>
            <h3>Zassane z meteo Weather z daty {previousWeekDate}</h3>
            {isLoading ? <p>Loading...</p> : (
                <div>
                    <div className="left">
                        <ol>
                            {timeArray.map((time, index) => (
                                <li key={`time-${index}`}>{time}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="right">
                        <ol>
                            {temperatureArray.map((temp, index) => (
                                <li key={`temperature-${index}`}>{temp}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Waltuh;