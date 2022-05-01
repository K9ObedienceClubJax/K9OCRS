import React from 'react';
import moment from 'moment-timezone';

const LastUpdatedNote = ({ modifiedByName, modifiedByID, modifiedDate }) => {
    const showModifierInfo = modifiedByID !== 0;

    if (!showModifierInfo) return null;

    const lastUpdatedDate = moment(modifiedDate).format('MMMM Do, YYYY [at] h:mm A');

    return (
        <p className="text-muted text-center text-sm-end fst-italic fs-6">
            {`last updated by ${modifiedByName} (id: ${modifiedByID}) on ${lastUpdatedDate}`}
        </p>
    );
};

export default LastUpdatedNote;
