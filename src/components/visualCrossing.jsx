import React, { useEffect, useState } from "react";
import { getCurrentDate } from "../utils/getDates";
import axios from "axios";
import DownloadData from "./downloadData";


function VisualCrossing() {
    const visualCrossingURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tarnow?unitGroup=us&include=hours&key=WUUB5CLKC97FSMXZ6YK8GF4F6&contentType=json`;
    const [fullVisualCrossingInfo, setfullVisualCrossingInfo] = useState([]);

    useEffect(() => {
        axios
            .get(visualCrossingURL)
            .then((response) => {
                const forecastdays = response.data.days;
                const shortenedForecastdays = forecastdays.slice(0, 8);
                const fullInfo = shortenedForecastdays.reduce((acc, day) => {
                    const hourInfo = day.hours.map((hour) => {
                        return {
                            feelsLike: (5 / 9 * (hour.feelslike - 32)).toFixed(1),
                            rain: hour.precipprob,
                            humidity: hour.humidity,
                            temperature: (5 / 9 * (hour.temp - 32)).toFixed(1),
                            time: hour.datetime,
                            datetime: day.datetime,
                        };
                    });
                    return acc.concat(hourInfo);
                }, []);
                setfullVisualCrossingInfo(fullInfo);
            })
            .catch((error) => console.error(error));
    }, [visualCrossingURL]);
    return (
        <section id="visualCrossingApi">
            <h2>Zassane z <u>Visual Crossing</u> z daty {getCurrentDate('-')} dla Tarnow</h2>
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
                    {fullVisualCrossingInfo.map((hour, index) => (
                        <tr key={`${hour.datetime}-${index}`}>
                            <td>{hour.datetime}</td>
                            <td>{hour.time}</td>
                            <td>{hour.temperature}</td>
                            <td>{hour.feelsLike}</td>
                            <td>{hour.humidity}</td>
                            <td>{hour.rain}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DownloadData updatedArray={fullVisualCrossingInfo} from={"Visual_Crossing"} />
        </section>
    )
}

export default VisualCrossing;