import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import selectors from '../../../shared/modules/selectors';
import PageHeader from '../../../shared/components/PageHeader';
import { Alert, Button, Spinner, Input, Form, FormGroup, Label, Col } from 'reactstrap';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import PageBody from '../../../shared/components/PageBody';

const Confirm = (props) => {
    const { sectionId } = useParams();
    const [sectionDetail, setSectionDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const classTypeConverted = parseInt(sectionDetail?.classType?.id)
    const { currentUser } = props;

    const [dogs, setDogs] = useState([]);

    const [dogSelected, setDogSelected] = useState(null);
    const [handlerInput, setHandlerInput] = useState('');
    const [attendeeInput, setAttendeeInput] = useState('');
    const [payment, setPayment] = useState('');

    
    let filledOut = dogSelected && payment;

    const handleSelectDog = (event) => {
        let setIndex = event.target.value;
        setIndex && setDogSelected(dogs[setIndex]);
        !setIndex && setDogSelected(null);
    };
    

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const Payload = {
            classTypeID: classTypeConverted,
            classSectionID: sectionId,
            dogID: dogSelected?.id,
            mainAttendee: handlerInput ? handlerInput : currentUser.firstName + " " + currentUser.lastName,
            additionalAttendees: attendeeInput,
            paymentMethod: payment,
        };
        axios.post('/api/Applications', Payload).then(response => {
            console.log(response.status);
            console.log(response.data.token);
        })

    }


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

                        <Form className='form' onSubmit={handleSubmit}>
                        <h4>Dog Selection</h4>
                        <p>Select a Dog*</p>
                        <div className='pb-3'>
                        <select onChange={handleSelectDog}>
                            <option value="">Please select a dog:</option>
                            {dogs?.map((canine, index) =>
                            {
                                return <option key={canine.id} value={index}>{canine.name}</option>
                            })}
                        </select>
                        </div>
                        {/* todo: need to format the age */}
                    {/* moment.js use dif to get age  */}
                        <p><b>Age:</b> { dogSelected?.dateOfBirth ? dogSelected?.dateOfBirth : "Not Selected" }</p>
                        <p><b>Breed:</b> {dogSelected?.breed ? dogSelected.breed : "Not Selected"}</p>
                        {/* todo: I don't see vaccination record status in the dogs api */}
                        <p className='pb-3'><b>Vaccination Record:</b> Not in api</p>

                        <h4>Attendees</h4>
                            <FormGroup >
                                <Label for="handler">Person working the dog*</Label>
                                <Col sm={5}>
                                <Input
                                    onChange={(e) => setHandlerInput(e.target.value)}
                                    type='text'
                                    placeholder='List the full name of the person that will handle the dog'
                                    htmlFor='handler'
                                    name='handler'
                                    id='handler'
                                    value={handlerInput}
                                />
                                </Col>
                            </FormGroup>
                            <FormGroup >
                                <Label for='attendee'>Other Attendees</Label>
                                <Col sm={8}>
                                <Input
                                onChange={(e) => setAttendeeInput(e.target.value)}
                                type="textarea"
                                placeholder='List the names of every additonal person that will attend the class with this dog'
                                htmlFor='attendee'
                                name='attendee'
                                id='attendee'
                                value={attendeeInput}
                                />
                                </Col>
                            </FormGroup>
                            <FormGroup tag='fieldset'>
                                <legend><h4>Payment Method</h4></legend>
                                <Label for='payment'>Select the method you want to use to submit your payment, your payment must be submitted before your application can be approved</Label>
                                <FormGroup check>
                                    <Label check>
                                        <Input type='radio' name='radio1' onClick={() => setPayment('Paypal')} />{''} Paypal
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type='radio' name='radio1' onClick={() => setPayment('Zelle')} />{''} Zelle
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type='radio' name='radio1' onClick={() => setPayment('Check')}/>{''} Check
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                           {filledOut ? <Button color='primary' size='lg'>Submit Application</Button> : <Button color="secondary" size="lg" disabled>Submit Application</Button>}
                        </Form>
                        

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
