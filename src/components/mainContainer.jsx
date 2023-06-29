import React, { useEffect, useState } from "react";
import {
    getForecastDataFromApi,
    getHistoricalWeatherDataFromApi,
    joinJsons,
} from "../utils/weatherDataService";
import MeanAbsErrorTable from "./MeanAbsErrorTable";
import ComparisonLineChart from "./ComparisonLineChart";
import { PercentWithinTemperatureRange } from "./PercentWithinTemperatureRange";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/mainContainerStyle.scss';

function MainContainer() {
    const [startDate, setStartDate] = useState(null);
    const [lengthOfComparisonInDays, setLengthOfComparisonInDays] = useState(10);
    const [weatherForecastsComparisonData, setWeatherForecastsComparisonData] =
        useState(new Map());

    const weatherDataCollectionNames = [
        {
            name: "visualcrossings",
            label: "Visual Crossing",
        },
        {
            name: "meteoweathers",
            label: "Meteo Weather",
        },
        {
            name: "tomorrowapis",
            label: "Tomorrow API",
        },
    ];

    useEffect(() => {
        if (startDate) {
            handleLoadingData();
        }
    }, [startDate, lengthOfComparisonInDays]);

    async function handleLoadingData() {
        const rawHistoricalWeatherData = await getHistoricalWeatherDataFromApi(
            startDate,
            lengthOfComparisonInDays
        );

        const dataFromForecastCollections = await Promise.all(
            weatherDataCollectionNames.map(async (item) => {
                const { name } = item;
                const data = await getForecastDataFromApi(
                    startDate,
                    lengthOfComparisonInDays,
                    name
                );
                return {
                    name,
                    data: data.data.data,
                };
            })
        );

        const joinedWeatherAndHistoricalData = new Map();
        dataFromForecastCollections.forEach((item) => {
            const { name, data } = item;
            const joinedData = joinJsons(
                rawHistoricalWeatherData.data.hourly,
                data
            );
            joinedWeatherAndHistoricalData.set(name, joinedData);
        });

        setWeatherForecastsComparisonData(joinedWeatherAndHistoricalData);
    }

    const handleLengthChange = (event) => {
        const selectedLength = parseInt(event.target.value);
        setLengthOfComparisonInDays(selectedLength);
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        console.log(selectedDate);
        setStartDate(selectedDate);
    };

    const handleDataButtonClick = () => {
        if (startDate) {
            handleLoadingData();
        }
    };

    return (
        <div className="mainContainer">
            <div
            // className="form-group"
            >
                <label htmlFor="startDate">Wybierz datę rozpoczęcia:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate || ""}
                    onChange={handleDateChange}
                // className="form-control"
                />
                <button
                    onClick={handleDataButtonClick}
                // className="btn btn-primary mt-2"
                >
                    Załaduj dane
                </button>
            </div>

            <select
                onChange={handleLengthChange}
                disabled={!startDate}
            // className="form-select mt-3"
            >
                <option value={1}>1 dzień</option>
                <option value={2}>2 dni</option>
                <option value={3}>3 dni</option>
                <option value={4}>4 dni</option>
                <option value={5}>5 dni</option>
            </select>

            {startDate && weatherForecastsComparisonData.size !== 0 && (
                <div id="weathers">
                    <div className="flex-item">
                        <MeanAbsErrorTable
                            weatherData={weatherForecastsComparisonData}
                            whatParameterToCompare={"temperature"}
                            header={"Średni błąd bezwzględny - temperatura"}
                        />
                    </div>
                    <div className="flex-item">
                        <MeanAbsErrorTable
                            weatherData={weatherForecastsComparisonData}
                            whatParameterToCompare={"rain"}
                            header={"Średni błąd bezwzględny - opady"}
                        />
                    </div>
                    <div className="flex-item">
                        <PercentWithinTemperatureRange
                            weatherData={weatherForecastsComparisonData}
                            header={"% w ciągu n°C"}
                        />
                    </div>
                    {weatherDataCollectionNames.map((item) => {
                        const { name, label } = item;
                        return (
                            <div key={name}>
                                <h4 className="data-source-label">Źródło: {label}</h4>
                                <ComparisonLineChart
                                    whatParameterToCompare={"Temperature"}
                                    weatherData={weatherForecastsComparisonData.get(name)}
                                />
                                <ComparisonLineChart
                                    whatParameterToCompare={"ApparentTemperature"}
                                    weatherData={weatherForecastsComparisonData.get(name)}
                                />
                                <ComparisonLineChart
                                    whatParameterToCompare={"Rain"}
                                    weatherData={weatherForecastsComparisonData.get(name)}
                                />

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MainContainer;
