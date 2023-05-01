import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentDate } from "../utils/getDates";
import DownloadData from "./downloadData";
import BChart from "./barChart";
import { weatherApiURL } from "../config";

function ApiWeather(props) {
    const [fullApiWeatherInfo, setFullApiWeatherInfo] = useState([]);
    useEffect(() => {
        axios
            .get(weatherApiURL)
            .then((response) => {
                const forecastdays = response.data.forecast.forecastday;
                const fullInfo = forecastdays.reduce((acc, forecastday) => {
                    const hourInfo = forecastday.hour.map((hour) => {
                        const hourObj = {
                            feelsLike: hour.feelslike_c,
                            rain: hour.chance_of_rain,
                            humidity: hour.humidity,
                            temperature: hour.temp_c,
                            time: hour.time,
                            date: forecastday.date,
                            // datetimeWithTime: `${new Date(forecastday.date).toLocaleDateString()} ${hour.time
                            //     .slice(-5)
                            // }`
                            datetimeWithTime: `${new Date(forecastday.date).toLocaleDateString()} ${new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
                        };
                        return hourObj;
                    });
                    return [...acc, ...hourInfo];
                }, []);
                setFullApiWeatherInfo(fullInfo);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        props.onArrayUpdate(fullApiWeatherInfo);
    })

    // reduce() do przechodzenia przez wszystkie indeksy forecastday[]
    // map() do przechodzenia przez wszystkie indeksy hour[] dla każdego indeksu forecastday[].
    // Tworzy nową tablicę fullInfo, która zawiera wszystkie godzinowe informacje o pogodzie, a następnie ustawia ją na zmienną stanu fullApiWeatherInfo.

    return (
        <section id="weatherApi">
            <h2>Zassane z <u>Weather Api</u> z daty {getCurrentDate('-')} dla Tarnow</h2>
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
                    {fullApiWeatherInfo.map((hour) => (
                        <tr key={hour.time}>
                            <td>{hour.date}</td>
                            <td>{hour.time.slice(-5)}</td>
                            <td>{hour.temperature}</td>
                            <td>{hour.feelsLike}</td>
                            <td>{hour.humidity}</td>
                            <td>{hour.rain}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
            <BChart
                width={1000}
                height={700}
                fullWeatherArray={fullApiWeatherInfo}
                xDataKey="datetimeWithTime"
                barDataKey1="feelsLike"
                barDataKey2="temperature"
            />
            <DownloadData updatedArray={fullApiWeatherInfo} from={"WeatherApi"} />
        </section>
    )

}

export default ApiWeather;