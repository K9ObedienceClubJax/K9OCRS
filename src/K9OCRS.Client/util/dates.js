// I might not use all of these but it's best to have them around
import moment from 'moment';

export const DefaultDateFormat = 'MM/DD/YYYY';
export const ShortDateFormat = 'MM/DD/YY';
export const ServerDateFormat = 'YYYY-MM-DD';

export const formatDate = (date, format = DefaultDateFormat) => moment(date).format(format);

export const formatServerDate = (date, format = ServerDateFormat) => moment(date).format(format);

export const getYear = date => moment(date).year();

export const earliestDate = (dates = [], format = DefaultDateFormat) => Array.isArray(dates) && dates.length
  ? moment.min(dates.map(d => moment(d))).format(format)
  : null;

export const latestDate = (dates = [], format = DefaultDateFormat) => Array.isArray(dates) && dates.length
  ? moment.max(dates.map(d => moment(d))).format(format)
  : null;

export const isSameDate = (dateA, dateB) => moment(dateA).isSame(dateB);
export const isBefore = (dateA, dateB) => moment(dateA).isBefore(dateB);

export const Today = moment().format(DefaultDateFormat);

export const momentToDate = date => moment(date).toDate();