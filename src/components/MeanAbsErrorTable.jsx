import { getFirstNDaysFromGivenWeatherData } from "../utils/getDates";
import { meanAbsoluteErrorOfWeatherData } from "../utils/statistics";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MeanAbsErrorTable({ weatherData, whatParameterToCompare, header }) {
    const numDisplayDays = 5;
    function tableRow(weatherDataFromSingleApi) {

        let tdsWithResults = [];
        for (let i = 1; i <= numDisplayDays; i++) {
            const dataForEachTd = getFirstNDaysFromGivenWeatherData(weatherDataFromSingleApi, i);
            const meanAbsErrorForEachId = meanAbsoluteErrorOfWeatherData(dataForEachTd, whatParameterToCompare);

            tdsWithResults.push(
                <td key={i}>
                    {
                        meanAbsErrorForEachId.toFixed(2)

                    }
                </td>
            );
        }

        return (
            <tr key={Math.random()}>

                <td>
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
            <td key={i}>
                {
                    i + ' Dni'
                }
            </td>
        );
    }


    return (
        <div>
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th colSpan={numDisplayDays + 1}>
                            {header}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="col">Dostawca prognozy:</th>
                        {tdsWithDayLabel}
                    </tr>
                    {tableRows()}
                </tbody>
            </table>
        </div>
    );


}