import {getForecastDataFromApi, getHistoricalWeatherDataFromApi, joinJsons} from "./weatherDataService";
import {getFirstNDaysFromGivenWeatherData} from "./getDates";
import {meanAbsoluteErrorOfWeatherData} from "./statistics";
import {addDays, format} from "date-fns";

const firstDay = '2023-05-14';
const lastDay = '2023-06-24';
const lengthOfComparisonInDays = 5;
const whatParameterToCompare = 'temperature';

const weatherDataCollectionNames = [
    {
        name: "visualcrossings",
        label: "Visual Crossing",
    },
    {
        name: "meteoweathers",
        label: "Meteo Weather",
    },
    {
        name: "tomorrowapis",
        label: "Tomorrow API",
    },
];

async function getRawDataFromSingleDay(startDate) {
    const rawHistoricalWeatherData = await getHistoricalWeatherDataFromApi(
        startDate,
        lengthOfComparisonInDays
    );

    const dataFromForecastCollections = await Promise.all(
        weatherDataCollectionNames.map(async (item) => {
            const {name} = item;
            const data = await getForecastDataFromApi(
                startDate,
                lengthOfComparisonInDays,
                name
            );
            return {
                name,
                data: data.data.data,
            };
        })
    );

    const joinedWeatherAndHistoricalData = new Map();
    dataFromForecastCollections.forEach((item) => {
        const {name, data} = item;
        const joinedData = joinJsons(
            rawHistoricalWeatherData.data.hourly,
            data
        );
        joinedWeatherAndHistoricalData.set(name, joinedData);
    });

    return joinedWeatherAndHistoricalData;
}

//tbh naming of all this functions is absolutely awful, but I have no time and I don't care, project is done
function getMAEfromSingleDaySingleApiAndGivenDays(weatherDataFromSingleApi, daysToCalculate) {
    const formattedData = getFirstNDaysFromGivenWeatherData(weatherDataFromSingleApi, daysToCalculate);
    const meanAbsError = meanAbsoluteErrorOfWeatherData(formattedData, whatParameterToCompare);
    return meanAbsError;
}

function getMAEfromSingleApiAndForDifferentDays(weatherDataFromSingleApi) {
    const result = new Array();
    for (let i = 1; i <= lengthOfComparisonInDays; i++) {
        result.push(getMAEfromSingleDaySingleApiAndGivenDays(weatherDataFromSingleApi, i));
    }
    return result;
}

function getMAEfromEachApi(weatherDataFromDifferentApis) {
    const result = Array.from(weatherDataFromDifferentApis).map(([key, value]) => {
        return getMAEfromSingleApiAndForDifferentDays(value);
    });
    return result;
}

function addOneDayToDateString(dateString) {
    const originalDate = new Date(dateString);
    const incrementedDate = addDays(originalDate, 1);
    const formattedDate = format(incrementedDate, 'yyyy-MM-dd');
    return formattedDate;
}

function isDateBefore(firstDate, secondDate) {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    return date1 < date2;
}

export async function getMAEfromAllData() {
    let result = new Array();
    for (let day = firstDay; isDateBefore(day, lastDay); day = addOneDayToDateString(day)) {
        try {
            const rawWeatherData = await getRawDataFromSingleDay(day);
            result.push(getMAEfromEachApi(rawWeatherData));
        } catch (error) {
            console.log('error while getting data from api for day: ', day, ' error: ', error);
        }

    }
    console.log(result);
    return result;
}


export async function getFinalMAEforEachApi() {
    const splittedData = await getMAEfromAllData();

    const result = new Map();
    weatherDataCollectionNames.map((value, index) => {
        let resultsForEachDay = new Array();
        for (let i = 0; i < 5; i++) {
            let sum = 0;
            let numberOfElements = 0;
            for (const element of splittedData) {
                if (isNaN(element[index][i])) {
                    continue;
                }

                sum += element[index][i];
                numberOfElements++;
            }
            resultsForEachDay.push(sum / numberOfElements);
        }

        result.set(value.name, resultsForEachDay);
    })
    return result;
}
