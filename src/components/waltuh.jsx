import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/weatherStyle.scss';
import { getCurrentDate, getPreviousWeekDate } from "../utils/getDates";


function Waltuh() {
    const [timeArray, setTimeArray] = useState([]);
    const [temperatureArray, setTemperatureArray] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const today = getCurrentDate('-');
    const previousWeekDate = getPreviousWeekDate('-');
    const meteoWeatherURL = `https://archive-api.open-meteo.com/v1/archive?latitude=50.01&longitude=20.99&start_date=${previousWeekDate}&end_date=${previousWeekDate}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;

    useEffect(() => {
        axios.get(meteoWeatherURL).then((response) => {
            const hourly = response.data.hourly;
            setTimeArray(hourly.time);
            setTemperatureArray(hourly.temperature_2m);
            setIsLoading(false);
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