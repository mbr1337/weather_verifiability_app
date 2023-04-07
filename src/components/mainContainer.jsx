import React, { useEffect, useState } from "react";
import MeteoWeather from "./meteoWeather";
import ApiWeather from "./apiWeather";

function MainContainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [updatedMeteoWeatherArray, setUpdatedMeteoWeatherArray] = useState([]);
    const [updatedWeatherApiArray, setUpdatedWeatherApiArray] = useState([]);

    function handleMeteoArrayUpdate(updatedArray) {
        setUpdatedMeteoWeatherArray(updatedArray);
    }
    function handleWeatherApiArrayUpdate(updatedArray) {
        setUpdatedWeatherApiArray(updatedArray);
    }
    // const weatherBitURL = `https://api.weatherbit.io/v2.0/history/hourly?lat=50.01&lon=20.99&start_date=${previousWeekDateMinusOne}&end_date=${previousWeekDate}&key=be3b07c2cf8742a992f1c40367ea1348`;
    // https://www.weatherbit.io/history/hourly
    // https://www.weatherbit.io/api

    // useEffect(() => {
    //     axios.get(weatherBitURL).then((response) => {
    //         console.log(response.data);
    //     })
    //         .catch(error => console.error(error));
    // }, []);

    return (
        <div className="mainContainer">
            {/* zmienic isloading na true */}
            {isLoading ? <p>Loading...</p> : (
                <div id="weathers">
                    <MeteoWeather onArrayUpdate={handleMeteoArrayUpdate} />
                    <ApiWeather onArrayUpdate={handleWeatherApiArrayUpdate} />
                </div>

            )}
        </div>
    );
}

export default MainContainer;