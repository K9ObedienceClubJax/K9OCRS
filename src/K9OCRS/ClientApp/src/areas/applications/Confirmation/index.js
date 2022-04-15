import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import selectors from '../../../shared/modules/selectors';
import PageHeader from '../../../shared/components/PageHeader';
import { Alert, Button, Spinner, Input } from 'reactstrap';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import PageBody from '../../../shared/components/PageBody';

const Confirm = (props) => {
    const { sectionId } = useParams();
    const [sectionDetail, setSectionDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [dogs, setDogs] = useState([]);

    const [dogSelected, setDogSelected] = useState([]);

    // todo: how to put setDogSelected back to null if user chooses
    //Please select a dog from dropdown list after selecting a dog???
    const handleSelectDog = (event) => {
        let setIndex = event.target.value;
        setIndex && setDogSelected(dogs[setIndex]);
        !setIndex && setDogSelected(null);
    };
    //const { currentUser } = props;

    useEffect(() => {
        async function getTest() {
            if (sectionId) {
                try {
                    const res = await axios.get(`/api/ClassSections/ ${sectionId}`);
                    setSectionDetail(res?.data);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setAlerts([
                        {
                            color: 'danger',
                            message: "We're having issues getting the details for this class",
                        },
                    ]);
                }
            }
        }
        getTest();
    }, [sectionId]);

    useEffect(() => {
        async function getTest() {
                try {
                    const res = await axios.get(`/api/Dogs`);
                    setDogs(res?.data);
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    setAlerts([
                        {
                            color: 'danger',
                            message: "We're having issues getting your dogs",
                        },
                    ]);
                }
        }
        getTest();
    }, []);

    return (
        <>
            <PageHeader className="container"
                title={sectionDetail?.classType?.title ?? 'Confirm'}
                alerts={alerts}
                breadCrumbItems={[
                    { label: 'Class Catalog', path: '/' },
                    {
                        label: sectionDetail?.classType?.title ?? 'Class',
                        path: `/Classes/${sectionDetail?.classType?.id}`,
                    },
                    { label: 'Application', active: true },
                ]}
                setAlerts={setAlerts}
            >
                <Button color="secondary" outline>
                    Cancel
                </Button>
                <Button color="primary">Submit Application</Button>
                {/* todo: create a function to post to api/Applications
                    but need to figure out how to deduct available seats in class roster
                    and check dog vaccination records
                    Make try/catch - if value of dogSelected === 'none' throw error
                */}

            
            </PageHeader>
            <PageBody>
                <Alert color="info">
                    <h3>Review your application</h3>
                    <span>
                        Please review the class' details, then select the dog that you want to
                        register for this class section and verify that the dog's information is
                        comlete and up to date.
                    </span> 
                </Alert>
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <h4>Class Instructor</h4>
                        <ProfileBadge
                            className="d-inline-flex pb-3"
                            {...sectionDetail?.instructor}
                            imageUrl={sectionDetail?.instructor?.profilePictureUrl}
                        />
                        <h4>Class Schedule</h4>
                        <i>Note that these dates and times are subject to change</i>
                        <ol className='pb-3'>
                            {sectionDetail?.meetings?.map((meeting) => {
                                // Use the momentjs package to format dates
                                var startDate = moment(meeting.startDate);
                                var endDate = moment(meeting.endDate);

                                // Create the format string
                                var endTimeFormat = endDate.minutes() > 0 ? 'h:mma' : 'ha';
                                var startTimeFormat = startDate.minutes() > 0 ? 'h:mm' : 'h';
                                // Display start time's am or pm only if it is different from end time's
                                var startDateAmPm =
                                    startDate.format('A') !== endDate.format('A') ? 'a' : '';
                                var formatString = `dddd, MMMM Do, YYYY [from] ${startTimeFormat}${startDateAmPm}-`;

                                // Format the dates using the format strings
                                var formattedStartDateAndTime = startDate.format(formatString);
                                var formattedEndTime = endDate.format(endTimeFormat);

                                return (
                                    <li
                                        key={meeting.id}
                                    >{`${formattedStartDateAndTime}${formattedEndTime}`}</li>
                                );
                            })}
                        </ol>
                        <h4>Class Requirements</h4>
                        <p className='pb-3'>{sectionDetail?.classType?.requirements}</p>


                        <h4>Dog Selection</h4>
                        <p>Select a Dog*</p>
                        <div className='pb-3'><label htmlFor="dogs">Choose a dog: &nbsp;</label>
                        <select onChange={handleSelectDog}>
                            <option value="">Please select a dog:</option>
                            {dogs?.map((canine, index) =>
                            {
                                return <option key={canine.id} value={index}>{canine.name}</option>
                            })}
                        </select>
                        </div>
                        {/* todo: need to format the age */}
                        {/* todo: Not Selected option breaks when going back to Please select a dog */}
                        <p><b>Age:</b> { dogSelected.dateOfBirth ? dogSelected?.dateOfBirth : "Not Selected" }</p>
                        <p><b>Breed:</b> {dogSelected?.breed}</p>
                        {/* todo: I don't see vaccination record status in the dogs api */}
                        <p className='pb-3'><b>Vaccination Record:</b> Not in api</p>

                        <h4>Attendees</h4>
                        
                        
                            <p>Person working the dog*</p>
                            {/* todo: need to adjust size of input boxes - too long */}
                            <div className='input-group mb-3'>
                            <Input
                                type='text'
                                className='form-control'
                                placeholder='List the full name of the person that will handle the dog'
                                htmlFor='handler'
                                name='handler'
                            /></div>
                            <p>Other Attendees</p>
                            <div className='input-group mb-3'>
                            <Input
                                type="text"
                                className='form-control'
                                placeholder='List the names of every additonal person that will attend the class with this dog'
                                htmlFor='attendee'
                                name='attendee'
                            /></div>
                        

                    </>
                )}
            </PageBody>
        </>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(Confirm);
