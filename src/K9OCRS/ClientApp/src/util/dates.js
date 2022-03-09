import moment from 'moment-timezone';

// transform the dotnet timespan from our backend into a useful moment object
export const timespanToMoment = timespan => moment().startOf("day").add(moment.duration(timespan));