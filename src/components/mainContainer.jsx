import React, {useEffect, useState} from "react";
import {getForecastDataFromApi, getHistoricalWeatherDataFromApi, joinJsons} from "../utils/weatherDataService";
import MeanAbsErrorTable from "./MeanAbsErrorTable";
import ComparisonLineChart from "./ComparisonLineChart";
import {PercentWithinTemperatureRange} from "./PercentWithinTemperatureRange";

function MainContainer() {

    const [startDate, setStartDate] = useState('2023-06-03');
    const [lengthOfComparisonInDays, setLengthOfComparisonInDays] = useState(10);

    const [weatherForecastsComparisonData, setWeatherForecastsComparisonData] = useState(new Map());

    const weatherDataCollectionNames = [
        'visualcrossings',
        'meteoweathers',
        'tomorrowapis'
    ];

    useEffect(() => {
        handleLoadingData();
    }, [startDate, lengthOfComparisonInDays]);

    async function handleLoadingData() {
        const rawHistoricalWeatherData = await getHistoricalWeatherDataFromApi(startDate, lengthOfComparisonInDays);

        const dataFromForecastCollections = await Promise.all(
            weatherDataCollectionNames.map(async (name) => {
                const data = await getForecastDataFromApi(startDate, lengthOfComparisonInDays, name);
                return data.data.data; //naming, yes
            })
        );

        const joinedWeatherAndHistoricalData = new Map();
        weatherDataCollectionNames.map((name, index) => {
            const data = joinJsons(
                rawHistoricalWeatherData.data.hourly,
                dataFromForecastCollections[index]
            );
            joinedWeatherAndHistoricalData.set(name, data);
        })

        setWeatherForecastsComparisonData(joinedWeatherAndHistoricalData);
    }

    return (
        <div className="mainContainer">

            {
                weatherForecastsComparisonData.size !== 0 &&
                <div id="weathers">
                    <MeanAbsErrorTable
                        weatherData={weatherForecastsComparisonData}
                        whatParameterToCompare={'temperature'}
                        header={'Mean absolute error - temperature'}
                    />
                    <MeanAbsErrorTable
                        weatherData={weatherForecastsComparisonData}
                        whatParameterToCompare={'rain'}
                        header={'Mean absolute error - precipitation'}
                    />

                    <PercentWithinTemperatureRange
                        weatherData={weatherForecastsComparisonData}
                        header={'% within n°C'}
                    />

                    <ComparisonLineChart
                        startDate={startDate}
                        lengthInDays={lengthOfComparisonInDays}
                        collection={'visualcrossings'}
                        weatherData={weatherForecastsComparisonData.get('visualcrossings')}
                    />
                    <ComparisonLineChart
                        startDate={startDate}
                        lengthInDays={lengthOfComparisonInDays}
                        collection={'meteoweathers'}
                        weatherData={weatherForecastsComparisonData.get('meteoweathers')}
                    />
                    <ComparisonLineChart
                        startDate={startDate}
                        lengthInDays={lengthOfComparisonInDays}
                        collection={'tomorrowapis'}
                        weatherData={weatherForecastsComparisonData.get('tomorrowapis')}
                    />
                </div>

            }
        </div>
    );
}

export default MainContainer;
