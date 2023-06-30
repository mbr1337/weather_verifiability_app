export function meanAbsoluteErrorOfWeatherData(weatherData, whatParameterToCompare) {
    if (whatParameterToCompare !== 'temperature'
        && whatParameterToCompare !== 'rain'
    ) {
        throw Error('wrong dataToCompare')
    }

    let sum = 0;

    if (whatParameterToCompare === 'temperature') {
        for (const element of weatherData) {
            sum += Math.abs(element.forecastTemperature - element.historicalTemperature);
        }
    }
    if (whatParameterToCompare === 'rain') {
        for (const element of weatherData) {
            sum += Math.abs(element.forecastRain - element.historicalRain);
        }
    }

    return sum / weatherData.length;
}


export function percentWithinNCelsiusDegree(weatherData, n) {
    let numberOfPointsWithinRange = 0;
    for (const element of weatherData) {
        if (Math.abs(element.forecastTemperature - element.historicalTemperature) <= n) {
            numberOfPointsWithinRange++;
        }
    }

    return (numberOfPointsWithinRange / weatherData.length) * 100;
}
