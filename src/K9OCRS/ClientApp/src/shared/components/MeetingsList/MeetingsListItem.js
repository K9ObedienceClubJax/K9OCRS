import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from 'reactstrap';
import { BsXLg } from 'react-icons/bs';

const MeetingsListItem = (props) => {
    const {
        isNew,
        isPastDate,
        allowDelete,
        allowDeletePastDate,
        index,
        id,
        dayOfWeek,
        date,
        timeframe,
        deleteHandler,
    } = props;

    const cn = 'meetings-list__list-item';

    const showDelete = (allowDelete && !isPastDate) || allowDeletePastDate;

    return (
        <li key={id}>
            <div className={cn}>
                <p className={`${cn}__index`}>{index + 1}</p>
                <div className={`${cn}__content`}>
                    <p className={`${cn}__content-day`}>{dayOfWeek}</p>
                    <p className={`${cn}__content__datetime row row-cols-1 row-cols-sm-2 g-0`}>
                        <span className={`${cn}__content__datetime-date col col-sm-auto`}>
                            {date}
                        </span>
                        <span className={`${cn}__content__datetime-time col col-sm-auto`}>
                            {timeframe}
                        </span>
                    </p>
                    <div className={`${cn}__content__badges`}>
                        {isPastDate && (
                            <Badge color="secondary" className="me-1">
                                Past Meeting
                            </Badge>
                        )}
                        {isNew && <Badge color="info">New Meeting</Badge>}
                    </div>
                </div>
                {showDelete && (
                    <div className={`${cn}__buttons`}>
                        <Button size="sm" color="danger" onClick={() => deleteHandler(id)}>
                            <BsXLg />
                        </Button>
                    </div>
                )}
            </div>
        </li>
    );
};

MeetingsListItem.defaultProps = {
    isNew: false,
    isPastDate: false,
    allowDelete: false,
    allowDeletePastDate: false,
    deleteHandler: () => {},
};

MeetingsListItem.propTypes = {
    isNew: PropTypes.bool,
    isPastDate: PropTypes.bool,
    allowDelete: PropTypes.bool,
    allowDeletePastDate: PropTypes.bool,
    index: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    dayOfWeek: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
    deleteHandler: PropTypes.func,
};

export default MeetingsListItem;
