import {getFirstNDaysFromGivenWeatherData} from "../utils/getDates";
import {meanAbsoluteErrorOfWeatherData} from "../utils/statistics";

export default function MeanAbsErrorTable({weatherData, whatParameterToCompare, header}) {
    const numDisplayDays = 5;
    console.log(whatParameterToCompare);
    function tableRow(weatherDataFromSingleApi) {

        let tdsWithResults = [];
        for (let i = 1; i <= numDisplayDays; i++) {
            const dataForEachTd = getFirstNDaysFromGivenWeatherData(weatherDataFromSingleApi, i);
            const meanAbsErrorForEachId = meanAbsoluteErrorOfWeatherData(dataForEachTd, whatParameterToCompare);

            tdsWithResults.push(
                <td key={i} style={styles.cell}>
                    {
                        meanAbsErrorForEachId.toFixed(2)

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

    for (let i = 1; i <= numDisplayDays; i++) {
        tdsWithDayLabel.push(
            <td key={i} style={styles.cell}>
                {
                    i + ' Days'
                }
            </td>
        );
    }


    return (
        <table style={styles.table}>
            <tbody>
                <tr>
                    <td style={styles.caption} colSpan={numDisplayDays+1}>
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
