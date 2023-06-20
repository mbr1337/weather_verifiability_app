import React, { useEffect, useState } from "react";
import {
    getForecastDataFromApi,
    getHistoricalWeatherDataFromApi,
    joinJsons,
} from "../utils/weatherDataService";
import MeanAbsErrorTable from "./MeanAbsErrorTable";
import ComparisonLineChart from "./ComparisonLineChart";
import { PercentWithinTemperatureRange } from "./PercentWithinTemperatureRange";
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/mainContainerStyle.scss';

function MainContainer() {
    const [startDate, setStartDate] = useState(null);
    const [lengthOfComparisonInDays, setLengthOfComparisonInDays] = useState(10);
    const [weatherForecastsComparisonData, setWeatherForecastsComparisonData] =
        useState(new Map());

    const weatherDataCollectionNames = [
        {
            name: "visualcrossings",
            label: "Visual Crossings",
        },
        {
            name: "meteoweathers",
            label: "Meteo Weathers",
        },
        {
            name: "tomorrowapis",
            label: "Tomorrow APIs",
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
        setStartDate(selectedDate);
    };

    const handleDataButtonClick = () => {
        if (startDate) {
            handleLoadingData();
        }
    };

    return (
        <div className="mainContainer">
            <div className="form-group">
                <label htmlFor="startDate">Select Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate || ""}
                    onChange={handleDateChange}
                    className="form-control"
                />
                <button
                    onClick={handleDataButtonClick}
                    className="btn btn-primary mt-2"
                >
                    Load Data
                </button>
            </div>

            <select
                onChange={handleLengthChange}
                disabled={!startDate}
                className="form-select mt-3"
            >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
            </select>

            {startDate && weatherForecastsComparisonData.size !== 0 && (
                <div id="weathers">
                    <div className="flex-item">
                        <MeanAbsErrorTable
                            weatherData={weatherForecastsComparisonData}
                            whatParameterToCompare={"temperature"}
                            header={"Mean absolute error - temperature"}
                        />
                    </div>
                    <div className="flex-item">
                        <MeanAbsErrorTable
                            weatherData={weatherForecastsComparisonData}
                            whatParameterToCompare={"rain"}
                            header={"Mean absolute error - precipitation"}
                        />
                    </div>
                    <div className="flex-item">
                        <PercentWithinTemperatureRange
                            weatherData={weatherForecastsComparisonData}
                            header={"% within n°C"}
                        />
                    </div>
                    {weatherDataCollectionNames.map((item) => {
                        const { name, label } = item;
                        return (
                            <div key={name}>
                                <h4 className="data-source-label">Data Source: {label}</h4>
                                <ComparisonLineChart
                                    whatParameterToCompare={"Temperature"}
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
