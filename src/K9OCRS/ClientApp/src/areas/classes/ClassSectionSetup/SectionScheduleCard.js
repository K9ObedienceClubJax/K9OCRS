import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { formatToServerDateTime } from 'src/util/dates';
import MeetingsList from 'src/shared/components/MeetingsList';

const SectionScheduleCard = (props) => {
    const {
        isAdmin,
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
            <MeetingsList
                meetings={meetings}
                deleteHandler={handleDelete}
                allowDelete
                allowDeletePastDate={isAdmin}
            />
        </div>
    );
};

SectionScheduleCard.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
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
