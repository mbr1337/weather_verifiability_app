export function meanAbsoluteErrorOfWeatherData(weatherData, whatParameterToCompare) {
    console.log(whatParameterToCompare)
    if (whatParameterToCompare !== 'temperature'
        && whatParameterToCompare !== 'rain'
    ) {
        throw Error('wrong dataToCompare')
        return;
    }

    let sum = 0;

    if(whatParameterToCompare === 'temperature'){
        for (const element of weatherData) {
            sum += Math.abs(element.forecastTemperature - element.historicalTemperature);
        }
    }
    if(whatParameterToCompare === 'rain'){
        for (const element of weatherData) {
            sum += Math.abs(element.forecastRain - element.historicalRain);
        }
    }

    return sum / weatherData.length;
}


export function percentWithinNCelsiusDegree(weatherData, n){
    let numberOfPointsWithinRange = 0;
    for (const element of weatherData) {
        if (element.forecastTemperature <= n + element.historicalTemperature && element.forecastTemperature >= n - element.historicalTemperature) {
            numberOfPointsWithinRange++;
        }
    }

    return numberOfPointsWithinRange / weatherData.length * 100;
}
