import moment from 'moment-timezone';

export const SERVER_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// transform the dotnet timespan from our backend into a useful moment object
export const timespanToMoment = (timespan) =>
    moment().startOf('day').add(moment.duration(timespan));

export const formatToServerDateTime = (datetime) => moment(datetime).format(SERVER_DATETIME_FORMAT);
