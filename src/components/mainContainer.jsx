import React, { useEffect, useState } from "react";
import MeteoWeather from "./meteoWeather";
import ApiWeather from "./apiWeather";
import VisualCrossing from "./visualCrossing";
import CombinedLineChart from "./combinedLineChart";
import ComparisonLineChart from "./ComparisonLineChart";

function MainContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [updatedMeteoWeatherArray, setUpdatedMeteoWeatherArray] = useState([]);
    const [updatedWeatherApiArray, setUpdatedWeatherApiArray] = useState([]);
    const [updatedVisualCrossingArray, setUpdatedVisualCrossingArray] = useState([]);

    function handleArrayUpdate(updatedArray, updateFunction) {
        updateFunction(updatedArray);
    }

    return (
        <div className="mainContainer">
            {/* zmienic isloading na true */}
            {isLoading ? <p>Loading...</p> : (
                <div id="weathers">
                    {/*<MeteoWeather onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedMeteoWeatherArray)} />*/}
                    {/*<ApiWeather onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedWeatherApiArray)} />*/}
                    {/*<VisualCrossing onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedVisualCrossingArray)} />*/}
                    {/*<CombinedLineChart />*/}
                    <ComparisonLineChart startDate={'2023-05-20'} lengthInDays={10} collection={'visualcrossings'} />
                    {/*<ComparisonLineChart date={'2023-05-22'} collection={'meteoweathers'}/>*/}
                    {/*<ComparisonLineChart date={'2023-05-22'} collection={'tomorrowapis'}/>*/}
                </div>

            )}
        </div>
    );
}

export default MainContainer;
