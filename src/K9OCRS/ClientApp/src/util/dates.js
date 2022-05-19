import moment from 'moment-timezone';

export const CLUB_TIME_ZONE = 'America/New_York';
export const SERVER_DATETIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

// transform the dotnet timespan from our backend into a useful moment object
export const timespanToMoment = (timespan) =>
    moment().startOf('day').add(moment.duration(timespan));

export const formatToServerDateTime = (datetime) => moment(datetime).format(SERVER_DATETIME_FORMAT);

export const formatDogAge = (birthDate) => {
    const months = moment().diff(birthDate, 'months');
    const years = moment().diff(birthDate, 'years');
    const monthsModulo = months % 12;
    const hasMonths = monthsModulo !== 0;

    const monthsString = `${monthsModulo} month${monthsModulo >= 2 ? 's' : ''}`;

    if (months < 12) {
        return monthsString;
    } else {
        const yearsString = `${years} year${years >= 2 ? 's' : ''} `;
        return `${yearsString}${hasMonths ? monthsString : ''}`;
    }
};
