import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { isAdmin } from 'src/util/accessEvaluator';
import { CLUB_TIME_ZONE } from 'src/util/dates';

const LastUpdatedNote = ({ userIsAdmin, modifiedByName, modifiedByID, modifiedDate }) => {
    const showModifierInfo = userIsAdmin && !!modifiedByID;

    if (!showModifierInfo) return null;

    const lastUpdatedDate = moment
        .utc(modifiedDate)
        .tz(CLUB_TIME_ZONE)
        .format('MMMM Do, YYYY [at] h:mm A');

    return (
        <p className="text-muted text-center text-sm-end fst-italic fs-6">
            {`last updated by ${modifiedByName} (id: ${modifiedByID}) on ${lastUpdatedDate}`}
        </p>
    );
};

export default connect((state) => ({
    userIsAdmin: isAdmin(state.shared?.currentUser),
}))(LastUpdatedNote);
