import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import MeetingsListItem from './MeetingsListItem';

import './styles.scss';

const MeetingsList = (props) => {
    const {
        // allowDelete,
        // allowDeletePastDate,
        deleteHandler,
        meetings,
    } = props;

    const cn = 'meetings-list';

    const orderedMeetings = meetings.sort((a, b) => moment(a.startDate).diff(b.startDate));

    return (
        <ol className={cn}>
            {orderedMeetings?.map((meeting, idx) => {
                // Use the momentjs package to format dates
                var startDate = moment(meeting.startDate);
                var endDate = moment(meeting.endDate);
                var isPastDate = startDate.isBefore(moment());

                const dayOfWeek = startDate.format('dddd');
                const date = startDate.format('MMMM Do, YYYY');

                // Format the end time
                var endTimeFormat = endDate.minutes() > 0 ? 'h:mma' : 'ha';
                var startTimeFormat = startDate.minutes() > 0 ? 'h:mm' : 'h';

                // Display start time's am or pm only if it is different from end time's
                var startTimeAmPm = startDate.format('A') !== endDate.format('A') ? 'a' : '';

                var formattedEndTime = endDate.format(endTimeFormat);

                const timeframe = startDate.format(
                    `${startTimeFormat}${startTimeAmPm} [to] [${formattedEndTime}]`
                );

                return (
                    <MeetingsListItem
                        isNew={meeting.isNew}
                        isPastDate={isPastDate}
                        // allowDelete={}
                        // allowDeletePastDate={}
                        index={idx}
                        id={meeting.id}
                        dayOfWeek={dayOfWeek}
                        date={date}
                        timeframe={timeframe}
                        deleteHandler={deleteHandler}
                    />
                );
            })}
        </ol>
    );
};

MeetingsList.defaultProps = {
    allowDelete: false,
    allowDeletePastDate: false,
};

MeetingsList.propTypes = {
    allowDelete: PropTypes.bool,
    allowDeletePastDate: PropTypes.bool,
    deleteHandler: PropTypes.func.isRequired,
    meetings: PropTypes.array.isRequired,
};

export default MeetingsList;
