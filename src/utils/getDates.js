import {addDays, addHours, differenceInDays, format, parseISO} from "date-fns";

export function getCurrentDate(separator = '') {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`
}

export function getPreviousWeekDate(separator = '', numDays) {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - (7 + numDays));

    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;
}

export function getFormattedDateWithAddedTime(startDateString, numDays, numHours) {
    const date = new Date(startDateString);
    const dateWithAddedDays = addDays(date, numDays);
    const dateWithAddedHours = addHours(dateWithAddedDays, numHours);

    return format(dateWithAddedHours, 'yyyy-MM-dd');
}

export function getFirstNDaysFromGivenWeatherData(weatherData, n) {
    const firstDay = parseISO(weatherData[0].time);
    const result = weatherData.filter(data => {
        const difference = differenceInDays(firstDay, parseISO(data.time));
        //console.log(difference);
        return Math.abs(difference) <= n - 1;
    })
    return result;
}
