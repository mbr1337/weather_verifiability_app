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
                <td key={i} style={styles.cell}>
                    {
                        result.toFixed(2) + '%'
                    }
                </td>
            );
        }

        return (
            <tr key={Math.random()}>
                <td style={styles.cell}>
                    {weatherDataFromSingleApi[0].forecastSource}
                </td>
                {tdsWithResults}
            </tr>
        )
    }

    function tableRows() {
        const elements = Array.from(weatherData).map(([key, value]) => {
            return tableRow(value);
        });

        return elements;
    }

    let tdsWithDayLabel = [];

    for (let i = percentageRangeStart; i <= percentageRangeEnd; i++) {
        tdsWithDayLabel.push(
            <td key={i} style={styles.cell}>
                {
                    '% within ' + i + '°C'
                }
            </td>
        );
    }


    return (
        <table style={styles.table}>
            <tbody>
                <tr>
                    <td style={styles.caption} colSpan={percentageRangeEnd - percentageRangeStart + 1}>
                        {header}
                    </td>
                </tr>

                <tr>
                    <td style={styles.cell}>
                        Forecast provider:
                    </td>
                    {tdsWithDayLabel}
                </tr>

                {tableRows()}
            </tbody>
        </table>
    )

}


const styles = {
    table: {
        borderCollapse: 'collapse',
        margin: '45px'
    },
    cell: {
        border: '1px solid black',
        padding: '8px',
    },
    caption: {
        paddingBottom: '10px',
        fontWeight: 'bold',
        fontSize: '1.2em'
    }
};

