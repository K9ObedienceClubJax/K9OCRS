import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { Alert, Button, Spinner, Input, Form, FormGroup, Label, Col } from 'reactstrap';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { formatCurrency } from 'src/util/numberFormatting';
import selectors from '../../../shared/modules/selectors';
import PageHeader from '../../../shared/components/PageHeader';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import PageBody from '../../../shared/components/PageBody';
import MeetingsList from 'src/shared/components/MeetingsList';

const Confirm = (props) => {
    const { sectionId } = useParams();
    const [sectionDetail, setSectionDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const { currentUser } = props;

    const [dogs, setDogs] = useState([]);

    const [dogSelected, setDogSelected] = useState(null);
    const [handlerInput, setHandlerInput] = useState('');
    const [attendeeInput, setAttendeeInput] = useState('');
    const [payment, setPayment] = useState('');
    const [paymentSent, setPaymentSent] = useState(false);

    const filledOut = dogSelected && payment && handlerInput;
    const defaultAttendee = currentUser.firstName + ' ' + currentUser.lastName;

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

    const payload = {
        classTypeID: parseInt(sectionDetail?.classType?.id),
        classSectionID: parseInt(sectionId),
        dogID: dogSelected?.id,
        mainAttendee: handlerInput ? handlerInput : defaultAttendee,
        additionalAttendees: attendeeInput,
        paymentMethod: payment,
    };

    const handleSubmit = (isPaid = false) => {
        payload.isPaid = isPaid;

        axios.post('/api/Applications', payload).then((response) => {
            if (response.status === 200) {
                // redirect to a thank you page
                console.log(response.status);
                console.log(response.data.token);
            }
        });
    };

    useEffect(() => {
        if (paymentSent) {
            handleSubmit(paymentSent);
            setPaymentSent(false);
        }
    }, [paymentSent]); // eslint-disable-line

    const sectionName = `${sectionDetail?.classType?.title}: Section #${sectionDetail?.id}`;
    const sectionPrice = sectionDetail?.classType?.price;
    const instructorName = `${sectionDetail?.instructor?.firstName} ${sectionDetail?.instructor?.lastName}`;

    const order = {
        amount: {
            currency_code: 'USD',
            value: sectionPrice,
            breakdown: {
                item_total: {
                    currency_code: 'USD',
                    value: sectionPrice,
                },
                // Whenever we do implement the discounts, do this.
                // Also the amount.value must be equal to the total value after discounts
                // discount: {
                //     currency_code: 'USD',
                //     value: 20,
                // },
            },
        },
        items: [
            {
                name: sectionName,
                unit_amount: {
                    currency_code: 'USD',
                    value: sectionPrice,
                },
                quantity: 1,
                description: `${sectionName} with instructor ${instructorName}`,
            },
        ],
    };

    return (
        <>
            <PageHeader
                className="container"
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
                <Button color="primary" disabled={!filledOut} onClick={() => handleSubmit()}>
                    Submit Application
                </Button>
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
                        <MeetingsList meetings={sectionDetail?.meetings} />
                        <h4>Class Requirements</h4>
                        <p className="pb-3">{sectionDetail?.classType?.requirements}</p>

                        <Form className="form">
                            <h4>Dog Selection</h4>
                            <p>Select a Dog*</p>
                            <div className="pb-3">
                                <select onChange={handleSelectDog}>
                                    <option value="">Please select a dog:</option>
                                    {dogs?.map((canine, index) => {
                                        return (
                                            <option key={canine.id} value={index}>
                                                {canine.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <p>
                                <b>Date of Birth </b>:{' '}
                                {dogSelected?.dateOfBirth
                                    ? moment(dogSelected?.dateOfBirth).format('MMM d, YYYY')
                                    : 'Not Selected'}
                            </p>
                            <p>
                                <b>Age:</b>{' '}
                                {moment().diff(dogSelected?.dateOfBirth, 'months') < 12
                                    ? moment().diff(dogSelected?.dateOfBirth, 'months') + ' months'
                                    : moment().diff(dogSelected?.dateOfBirth, 'years') +
                                      ' year(s), ' +
                                      (moment().diff(dogSelected?.dateOfBirth, 'months') % 12) +
                                      ' months'}
                            </p>
                            <p>
                                <b>Breed:</b>{' '}
                                {dogSelected?.breed ? dogSelected.breed : 'Not Selected'}
                            </p>
                            {/* todo: I don't see vaccination record status in the dogs api */}
                            <p className="pb-3">
                                <b>Vaccination Record:</b> Not in api
                            </p>

                            <h4>Attendees</h4>
                            <p>{defaultAttendee}</p>
                            <FormGroup>
                                <Label for="handler">Person working the dog*</Label>
                                <Col sm={5}>
                                    <Input
                                        onChange={(e) => setHandlerInput(e.target.value)}
                                        type="text"
                                        placeholder="List the full name of the person that will handle the dog"
                                        htmlFor="handler"
                                        name="handler"
                                        id="handler"
                                        value={handlerInput}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Label for="attendee">Other Attendees</Label>
                                <Col sm={8}>
                                    <Input
                                        onChange={(e) => setAttendeeInput(e.target.value)}
                                        type="textarea"
                                        placeholder="List the names of every additonal person that will attend the class with this dog"
                                        htmlFor="attendee"
                                        name="attendee"
                                        id="attendee"
                                        value={attendeeInput}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup tag="fieldset">
                                <legend>
                                    <h4>Payment Method</h4>
                                </legend>
                                <p>
                                    <b>Price:</b> {formatCurrency(sectionDetail?.classType?.price)}
                                </p>
                                <Label for="payment">
                                    Select the method you want to use to submit your payment, your
                                    payment must be submitted before your application can be
                                    approved
                                </Label>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="radio"
                                            name="radio1"
                                            onClick={() => setPayment('Paypal')}
                                        />
                                        {''} Paypal
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="radio"
                                            name="radio1"
                                            onClick={() => setPayment('Zelle')}
                                        />
                                        {''} Zelle
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="radio"
                                            name="radio1"
                                            onClick={() => setPayment('Check')}
                                        />
                                        {''} Check
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                            {payment === 'Paypal' && (
                                <PayPalButtons
                                    disabled={!filledOut}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [order],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            setPaymentSent(true);
                                        });
                                    }}
                                />
                            )}
                            {payment !== 'Paypal' && (
                                <Button
                                    color="primary"
                                    size="lg"
                                    disabled={!filledOut}
                                    onClick={() => handleSubmit()}
                                >
                                    Submit Application
                                </Button>
                            )}
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
