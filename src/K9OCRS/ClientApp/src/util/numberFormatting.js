import numbro from 'numbro';

const defaultEmptyIndicator = '--';

const currencyFormat = {
    thousandSeparated: true,
    // mantissa: 2,
};

const percentageFormat = {
    output: 'percent',
};

// Most formatting methods will be very similar so this abstraction helps
// to avoid having lots of duplicate code
const buildFormatter = (formatOptions, prefix = '', postfix = '') => {
    return (number, emptyIndicator = defaultEmptyIndicator, formatOverrides = {}) => {
        // if there's no value just return a string that indicates that
        // this can be customized by passing a string after the number argument
        if (number === null || number === undefined) return emptyIndicator;

        return `${prefix}${numbro(number).format({
            ...formatOptions,
            ...formatOverrides,
        })}${postfix}`;
    };
};

export const formatCurrency = buildFormatter(currencyFormat, '$');

export const formatPercentage = buildFormatter(percentageFormat);
