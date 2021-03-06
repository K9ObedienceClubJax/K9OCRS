/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FormGroup, Input, Label, Spinner, Form, Row, Col, Badge } from 'reactstrap';
import { Highlighter, Typeahead, Token } from 'react-bootstrap-typeahead';
import { getClassTypeOptions } from 'src/util/apiClients/classTypes';
import { getPaymentMethods } from 'src/util/apiClients/paymentMethods';
import PageHeader from '../../../shared/components/PageHeader';
import Table from '../../../shared/components/Table';
import PageBody from '../../../shared/components/PageBody';
import selectors from '../../../shared/modules/selectors';
import sectionColumns from './components/sectionColumns';
import ProfileBadge from 'src/shared/components/ProfileBadge';

const AppManagement = (props) => {
    const [loading, setLoading] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [alerts, setAlerts] = useState((c) => c, []);
    const [appDetails, setAppDetails] = useState([]);

    const [classTypeOptions, setClassTypeOptions] = useState([]);
    const [dogOptions, setDogOptions] = useState([]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

    // When the page loads, fetch the typeahead options
    useEffect(() => {
        async function getOptions() {
            const classTypesresponse = await getClassTypeOptions();
            setClassTypeOptions(classTypesresponse?.data);
            const dogsResponse = await axios.get('/api/dogs');
            setDogOptions(dogsResponse?.data);
            const paymentMethodsResponse = await getPaymentMethods(true, true);
            setPaymentMethodOptions(paymentMethodsResponse?.data);
            setLoadingOptions(false);
        }
        getOptions();
    }, []);

    const [selectedClassTypes, setSelectedClassTypes] = useState([]);
    const [selectedDogs, setSelectedDogs] = useState([]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);

    const [includePaid, setIncludePaid] = useState(true);
    const [includeRefunded, setIncludeRefunded] = useState(true);

    const [includePending, setIncludePending] = useState(true);
    const [includeActive, setIncludeActive] = useState(false);
    const [includeCompleted, setIncludeCompleted] = useState(false);
    const [includeCancelled, setIncludeCancelled] = useState(false);

    const selectedClassTypesString = JSON.stringify(selectedClassTypes);
    const selectedDogsString = JSON.stringify(selectedDogs);
    const selectedPaymentMethodsString = JSON.stringify(selectedPaymentMethods);
    useEffect(() => {
        async function getTest() {
            try {
                const res = await axios.post('/api/Applications/query', {
                    classTypeIDs: selectedClassTypes?.map((ct) => ct.id),
                    dogIDs: selectedDogs?.map((d) => d.id),
                    PaymentMethodIDs: selectedPaymentMethods?.map((pm) => pm.id),
                    includePaid,
                    includeRefunded,
                    includePending,
                    includeActive,
                    includeCompleted,
                    includeCancelled,
                });
                setAppDetails(res?.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setAlerts([
                    {
                        color: 'danger',
                        message: "We're having issues getting the applications",
                    },
                ]);
            }
        }
        getTest();
    }, [
        selectedClassTypesString,
        selectedDogsString,
        selectedPaymentMethodsString,
        includePaid,
        includeRefunded,
        includePending,
        includeActive,
        includeCompleted,
        includeCancelled,
    ]);

    const typeRenderMenuItemChildren = (option, { text }, index) => (
        <Fragment>
            <Highlighter key={index} search={text}>
                {`${option.title} ${option.isArchived ? '- [Archived]' : ''}`}
            </Highlighter>
        </Fragment>
    );

    const typeRenderToken = (option, { onRemove }, index) => (
        <Token key={index} onRemove={onRemove} option={option}>
            {`${option.title} ${option.isArchived ? '- [Archived]' : ''}`}
        </Token>
    );

    const typeLabelKey = (option) =>
        loadingOptions
            ? 'Loading...'
            : `${option.title} ${option.isArchived ? '- [Archived]' : ''}`;

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

    const dogRenderToken = (option, { onRemove }, index) => (
        <Token key={index} onRemove={onRemove} option={option}>
            <ProfileBadge
                id={option.id}
                imageUrl={option.profilePictureUrl}
                fullName={option.name}
                isDog
            />
        </Token>
    );

    const dogLabelKey = (option) =>
        loadingOptions ? 'Loading...' : `${option.name} ${option.isArchived ? '- [Archived]' : ''}`;

    const pmRenderMenuItemChildren = (option, { text }, index) => (
        <Fragment>
            <Highlighter key={index} search={text}>
                {`${option.name} ${option.isArchived ? '- [Archived]' : ''}`}
            </Highlighter>
        </Fragment>
    );

    const pmRenderToken = (option, { onRemove }, index) => (
        <Token key={index} onRemove={onRemove} option={option}>
            {`${option.name} ${option.isArchived ? '- [Archived]' : ''}`}
        </Token>
    );

    const pmLabelKey = (option) =>
        loadingOptions ? 'Loading...' : `${option.name} ${option.isArchived ? '- [Archived]' : ''}`;

    return (
        <div>
            <PageHeader
                title="Manage Applications"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Applications', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            ></PageHeader>
            <PageBody>
                <Form className="cardsurface">
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="classTypeInput">Class Type</Label>
                                <Typeahead
                                    id="ClassTypesTypeahead"
                                    labelKey={typeLabelKey}
                                    placeholder="Choose class types..."
                                    selected={selectedClassTypes}
                                    onChange={setSelectedClassTypes}
                                    disabled={loadingOptions}
                                    options={classTypeOptions}
                                    renderMenuItemChildren={typeRenderMenuItemChildren}
                                    renderToken={typeRenderToken}
                                    multiple
                                    flip
                                    clearButton
                                    positionFixed
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="dogInput">Dog</Label>
                                <Typeahead
                                    id="DogsTypeahead"
                                    labelKey={dogLabelKey}
                                    placeholder="Choose dogs..."
                                    selected={selectedDogs}
                                    onChange={setSelectedDogs}
                                    disabled={loadingOptions}
                                    options={dogOptions}
                                    renderMenuItemChildren={dogRenderMenuItemChildren}
                                    renderToken={dogRenderToken}
                                    multiple
                                    flip
                                    clearButton
                                    positionFixed
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="payMethod">Payment Method</Label>
                                <Typeahead
                                    id="PaymentMethodsTypeahead"
                                    labelKey={pmLabelKey}
                                    placeholder="Choose payment methods..."
                                    selected={selectedPaymentMethods}
                                    onChange={setSelectedPaymentMethods}
                                    disabled={loadingOptions}
                                    options={paymentMethodOptions}
                                    renderMenuItemChildren={pmRenderMenuItemChildren}
                                    renderToken={pmRenderToken}
                                    multiple
                                    flip
                                    clearButton
                                    positionFixed
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Row>
                                    <Label for="payStatus">Shown Payment Statuses:</Label>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup check inline>
                                            <Input
                                                type="checkbox"
                                                checked={includePaid}
                                                onChange={(e) => setIncludePaid(e.target.checked)}
                                                disabled={loading}
                                            />
                                            <Label check>Paid</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup check inline>
                                            <Input
                                                type="checkbox"
                                                checked={includeRefunded}
                                                onChange={(e) =>
                                                    setIncludeRefunded(e.target.checked)
                                                }
                                                disabled={loading}
                                            />
                                            <Label check>Refunded</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Label for="shownStatus">Shown Statuses</Label>
                    </Row>
                    <FormGroup check inline>
                        <Input
                            type="checkbox"
                            checked={includePending}
                            onChange={(e) => setIncludePending(e.target.checked)}
                            disabled={loading}
                        />
                        <Label check>Pending</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Input
                            type="checkbox"
                            checked={includeActive}
                            onChange={(e) => setIncludeActive(e.target.checked)}
                            disabled={loading}
                        />
                        <Label check>Active</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Input
                            type="checkbox"
                            checked={includeCompleted}
                            onChange={(e) => setIncludeCompleted(e.target.checked)}
                            disabled={loading}
                        />
                        <Label check>Completed</Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Input
                            type="checkbox"
                            checked={includeCancelled}
                            onChange={(e) => setIncludeCancelled(e.target.checked)}
                            disabled={loading}
                        />
                        <Label check>Cancelled</Label>
                    </FormGroup>
                </Form>
                {loading ? (
                    <Spinner />
                ) : (
                    <Table
                        columns={sectionColumns}
                        data={appDetails}
                        pageSize={12}
                        withPagination
                    />
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        currentUser: selectors.selectCurrentUser(state),
    }),
    {}
)(AppManagement);
