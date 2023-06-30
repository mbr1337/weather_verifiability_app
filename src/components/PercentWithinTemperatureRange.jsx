import { getFirstNDaysFromGivenWeatherData } from "../utils/getDates";
import { percentWithinNCelsiusDegree } from "../utils/statistics";

export function PercentWithinTemperatureRange({ weatherData, whatParameterToCompare, header }) {
    const percentageRangeStart = 1;
    const percentageRangeEnd = 5;

    const numOfDaysToCompare = 8;

    function tableRow(weatherDataFromSingleApi) {
        const dataForAllTds = getFirstNDaysFromGivenWeatherData(weatherDataFromSingleApi, numOfDaysToCompare);
        let tdsWithResults = [];

        for (let i = percentageRangeStart; i <= percentageRangeEnd; i++) {
            const result = percentWithinNCelsiusDegree(dataForAllTds, i);

            tdsWithResults.push(
                <td key={i}>
                    {result.toFixed(2)}%
                </td>
            );
        }

        return (
            <tr key={Math.random()}>
                <td>{weatherDataFromSingleApi[0].forecastSource}</td>
                {tdsWithResults}
            </tr>
        );
    }

    function tableRows() {
        return Array.from(weatherData).map(([key, value]) => {
            return tableRow(value);
        });
    }

    let tdsWithDayLabel = [];

    for (let i = percentageRangeStart; i <= percentageRangeEnd; i++) {
        tdsWithDayLabel.push(
            <th key={i}>
                % w ciągu {i}°C
            </th>
        );
    }

    return (
        <div>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th colSpan={percentageRangeEnd - percentageRangeStart + 2}>
                            {header}
                        </th>
                    </tr>
                    <tr>
                        <th>Dostawca prognozy:</th>
                        {tdsWithDayLabel}
                    </tr>
                </thead>
                <tbody>
                    {tableRows()}
                </tbody>
            </table>
        </div>
    );
}
