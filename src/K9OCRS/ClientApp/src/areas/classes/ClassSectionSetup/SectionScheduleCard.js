import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Badge, Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { BsXLg } from 'react-icons/bs';
import { formatToServerDateTime } from 'src/util/dates';

const SectionScheduleCard = (props) => {
    const {
        // isCreatingNewSection,
        submitting,
        meetings,
        setMeetings,
        meetingsToInsert,
        setMeetingsToInsert,
        setMeetingIdsToDelete,
    } = props;

    const cn = 'sectionSetup';

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleClear = () => {
        setDate('');
        setStartTime('');
        setEndTime('');
    };

    const handleAdd = () => {
        // Create Meeting object with a custom identifier
        const newMeeting = {
            id: `bogus-${meetingsToInsert?.length + 1}`,
            startDate: formatToServerDateTime(`${date} ${startTime}`),
            endDate: formatToServerDateTime(`${date} ${endTime}`),
            isNew: true,
        };

        // Add meeting to meetings to insert and meetings arrays
        setMeetingsToInsert((curr) => [...curr, newMeeting]);
        setMeetings((curr) => [...curr, newMeeting]);

        // Clear inputs
        handleClear();
    };

    const handleDelete = (id) => {
        const newButDeleted = meetingsToInsert.find((m) => m.id === id);

        if (!newButDeleted) {
            // Add id to meetingIdsToDelete array
            setMeetingIdsToDelete((curr) => [...curr, id]);
        } else {
            // if the custom identifier exists in the meetings to insert array, remove it.
            setMeetingsToInsert((curr) => curr.filter((m) => m.id !== newButDeleted?.id));
        }

        // Remove by index from the meetings array
        setMeetings((curr) => curr.filter((m) => m.id !== id));
    };

    const orderedMeetings = meetings.sort((a, b) => moment(a.startDate).diff(b.startDate));

    return (
        <div className={`${cn} cardsurface`}>
            <Row className="align-items-end">
                <Col>
                    <FormGroup>
                        <Label>Date</Label>
                        <Input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={submitting}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Start Time</Label>
                        <Input
                            type="time"
                            name="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            disabled={submitting}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>End Time</Label>
                        <Input
                            type="time"
                            name="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            disabled={submitting}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Button color="primary" disabled={submitting} onClick={handleAdd}>
                            Add Meeting
                        </Button>
                    </FormGroup>
                </Col>
            </Row>
            <ol>
                {orderedMeetings?.map((meeting) => {
                    // Use the momentjs package to format dates
                    var startDate = moment(meeting.startDate);
                    var endDate = moment(meeting.endDate);

                    // Create the format string
                    var endTimeFormat = endDate.minutes() > 0 ? 'h:mma' : 'ha';
                    var startTimeFormat = startDate.minutes() > 0 ? 'h:mm' : 'h';
                    // Display start time's am or pm only if it is different from end time's
                    var startDateAmPm = startDate.format('A') !== endDate.format('A') ? 'a' : '';
                    var formatString = `dddd, MMMM Do, YYYY [from] ${startTimeFormat}${startDateAmPm}-`;

                    // Format the dates using the format strings
                    var formattedStartDateAndTime = startDate.format(formatString);
                    var formattedEndTime = endDate.format(endTimeFormat);

                    return (
                        <li key={meeting.id}>
                            <span className="me-2">{`${formattedStartDateAndTime}${formattedEndTime}`}</span>
                            {meeting.isNew && (
                                <Badge color="info" className="me-2">
                                    New
                                </Badge>
                            )}
                            <BsXLg
                                className={`${cn}__meeting-remover`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(meeting.id)}
                            />
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

SectionScheduleCard.propTypes = {
    loading: PropTypes.bool.isRequired,
    isCreatingNewSection: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    meetings: PropTypes.array.isRequired,
    setMeetings: PropTypes.func.isRequired,
    meetingsToInsert: PropTypes.array.isRequired,
    setMeetingsToInsert: PropTypes.func.isRequired,
    setMeetingIdsToDelete: PropTypes.func.isRequired,
};

export default SectionScheduleCard;
