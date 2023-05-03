import React, { useEffect, useState } from "react";
import MeteoWeather from "./meteoWeather";
import ApiWeather from "./apiWeather";
import VisualCrossing from "./visualCrossing";
import CombinedLineChart from "./combinedLineChart";

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
                    <MeteoWeather onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedMeteoWeatherArray)} />
                    <ApiWeather onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedWeatherApiArray)} />
                    <VisualCrossing onArrayUpdate={(updatedArray) => handleArrayUpdate(updatedArray, setUpdatedVisualCrossingArray)} />
                    <CombinedLineChart />
                </div>

            )}
        </div>
    );
}

export default MainContainer;