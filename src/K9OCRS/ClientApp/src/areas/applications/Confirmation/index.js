import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import {
    Alert,
    Button,
    Spinner,
    Input,
    Form,
    FormGroup,
    Label,
    Col,
    Row,
    FormText,
    Badge,
} from 'reactstrap';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { formatCurrency } from 'src/util/numberFormatting';
import { getPaymentMethods } from 'src/util/apiClients/paymentMethods';
import selectors from '../../../shared/modules/selectors';
import PageHeader from '../../../shared/components/PageHeader';
import ProfileBadge from '../../../shared/components/ProfileBadge';
import PageBody from '../../../shared/components/PageBody';
import MeetingsList from 'src/shared/components/MeetingsList';
import { formatDogAge } from 'src/util/dates';

const Confirm = (props) => {
    const { sectionId } = useParams();
    const [sectionDetail, setSectionDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const { currentUser } = props;

    const [dogs, setDogs] = useState([]);
    const [pmOptions, setPmOptions] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [dogsSelected, setDogSelected] = useState([]);
    const dogSelected = dogsSelected.length > 0 ? dogsSelected[0] : null;
    const [handlerInput, setHandlerInput] = useState(
        currentUser ? currentUser.firstName + ' ' + currentUser.lastName : ''
    );
    const [attendeeInput, setAttendeeInput] = useState('');
    const [paymentSent, setPaymentSent] = useState(false);

    const filledOut = dogSelected && selectedPaymentMethod && handlerInput;

    const handleSelectPaymentMethod = (event) => {
        const idx = event.target.value;
        setSelectedPaymentMethod(pmOptions[idx]);
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
                const res = await axios.get(`/api/Dogs/owned`);
                setDogs(res?.data);
                const pmOptions = await getPaymentMethods();
                setPmOptions(pmOptions?.data);
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
        mainAttendee: handlerInput,
        additionalAttendees: attendeeInput,
        paymentMethodID: parseInt(selectedPaymentMethod?.id),
    };

    const navigate = useNavigate();

    const handleSubmit = (isPaid = false) => {
        payload.isPaid = isPaid;

        axios.post('/api/Applications', payload).then((response) => {
            if (response.status === 200) {
                const sectionId = response.data?.classSectionID;
                // redirect to a myclasses/{id} page
                navigate(`/Account/Classes/${sectionId}`);
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

    const dogRenderMenuItemChildren = (option, { text }, index) => (
        <Fragment>
            <Row key={index}>
                <Col className="d-flex justify-content-start align-items-center">
                    <ProfileBadge
                        id={option.id}
                        imageUrl={option.profilePictureUrl}
                        fullName={option.name}
                        isDog
                    />
                </Col>
                <Col className="d-flex justify-content-start align-items-center">
                    {option.isArchived && (
                        <Badge color="dark" className="me-1">
                            Archived
                        </Badge>
                    )}
                    <span />
                </Col>
            </Row>
        </Fragment>
    );

    const dogLabelKey = (option) =>
        loading ? 'Loading...' : `${option.name} ${option.isArchived ? '- [Archived]' : ''}`;

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
                                <Typeahead
                                    id="DogsTypeahead"
                                    labelKey={dogLabelKey}
                                    placeholder="Choose dogs..."
                                    selected={dogsSelected}
                                    onChange={setDogSelected}
                                    disabled={loading}
                                    options={dogs}
                                    renderMenuItemChildren={dogRenderMenuItemChildren}
                                    flip
                                    clearButton
                                    positionFixed
                                    style={{ maxWidth: '400px' }}
                                />
                            </div>

                            <p>
                                <b>Date of Birth </b>:{' '}
                                {dogSelected?.dateOfBirth
                                    ? moment(dogSelected?.dateOfBirth).format('MMM d, YYYY')
                                    : 'Not Selected'}
                            </p>
                            <p>
                                <b>Age:</b>{' '}
                                {dogSelected?.dateOfBirth
                                    ? formatDogAge(dogSelected?.dateOfBirth)
                                    : 'Not Selected'}
                            </p>
                            <p>
                                <b>Breed:</b>{' '}
                                {dogSelected?.breed ? dogSelected.breed : 'Not Selected'}
                            </p>
                            {/* todo: I don't see vaccination record status in the dogs api */}
                            {/* <p className="pb-3">
                                <b>Vaccination Record:</b>
                            </p> */}

                            <h4>Attendees</h4>
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
                                    {handlerInput && (
                                        <FormText>
                                            List the full name of the person that will handle the
                                            dog
                                        </FormText>
                                    )}
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
                                    {attendeeInput && (
                                        <FormText>
                                            List the names of every additonal person that will
                                            attend the class with this dog
                                        </FormText>
                                    )}
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
                                <Input
                                    type="select"
                                    onChange={handleSelectPaymentMethod}
                                    style={{ maxWidth: '300px' }}
                                >
                                    <option value="">Please select a payment method</option>
                                    {pmOptions?.map((pm, index) => {
                                        return (
                                            <option key={pm.id} value={index}>
                                                {pm.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                            {/* PayPal's id is 1 */}
                            {selectedPaymentMethod?.id === 1 && (
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
                            {selectedPaymentMethod && !selectedPaymentMethod?.isIntegration && (
                                <p>
                                    {selectedPaymentMethod?.instructions}
                                    <br />
                                    <br />
                                    <b>
                                        You will see the required Application Number after you have
                                        submitted the application. We need this to identify which
                                        application the payment corresponds to.
                                    </b>
                                </p>
                            )}
                            {selectedPaymentMethod?.id !== 1 && (
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
