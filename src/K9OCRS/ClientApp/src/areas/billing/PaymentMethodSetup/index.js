import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Input, FormGroup, Label, FormText, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import * as actions from '../modules/actions';
import PageHeader from 'src/shared/components/PageHeader';
import PageBody from 'src/shared/components/PageBody';
import LastUpdatedNote from 'src/shared/components/LastUpdatedNote';

const PaymentMethodSetup = (props) => {
    const { getData, doUpdate, initializeAddition, doAdd, doDelete, loading, details } = props;
    const { paymentMethodId } = useParams();
    const navigate = useNavigate();
    const onCreationMode = !paymentMethodId;

    const isMounted = useRef(false);

    const [alerts, setAlerts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isArchived, setIsArchived] = useState(false);

    useEffect(() => {
        if (!onCreationMode) {
            getData({ id: paymentMethodId, setAlerts });
        } else {
            initializeAddition();
        }
    }, [paymentMethodId]); // eslint-disable-line

    const detailsString = JSON.stringify(details);
    useEffect(() => {
        if (!loading && isMounted.current) {
            setName(details.name);
            setDescription(details.description);
            setInstructions(details.instructions);
            setIsArchived(details.isArchived);
        } else {
            isMounted.current = true;
        }
    }, [detailsString]); // eslint-disable-line

    const data = {
        id: paymentMethodId,
        name,
        description,
        instructions,
        isArchived,
    };

    const handleSaveChanges = () => {
        const requiredFieldsPresent = !!name && !!instructions;

        if (requiredFieldsPresent) {
            if (!onCreationMode) {
                doUpdate({ data, setAlerts });
            } else {
                doAdd({ data, setAlerts, navigate });
            }
        } else {
            setAlerts((c) => [
                ...c,
                {
                    color: 'danger',
                    message: 'Please input a name and instructions before saving your changes.',
                },
            ]);
        }
    };

    const handleDelete = () => {
        if (window.confirm('This payment method will be deleted')) {
            doDelete({ paymentMethodId, setAlerts, navigate });
        }
    };

    const pageTitle = onCreationMode
        ? 'Payment Method Setup'
        : `Payment Method: ${loading ? 'Loading...' : details.name}`;

    return (
        <>
            <PageHeader
                title={pageTitle}
                alerts={alerts}
                setAlerts={setAlerts}
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Payment Methods', path: '/Manage/PaymentMethods' },
                    { label: pageTitle, active: true },
                ]}
            >
                {onCreationMode && (
                    <Button
                        color="secondary"
                        outline
                        onClick={() => navigate('/Manage/PaymentMethods')}
                    >
                        Cancel
                    </Button>
                )}
                {!onCreationMode && (
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                )}
                <Button color="primary" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </PageHeader>
            <PageBody>
                <LastUpdatedNote
                    modifiedByID={details?.modifiedByID}
                    modifiedByName={details?.modifiedByName}
                    modifiedDate={details?.modifiedDate}
                />
                <FormGroup>
                    <Label>Payment Method Name *</Label>
                    <Input
                        style={{ maxWidth: '400px' }}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        readOnly={details?.isIntegration}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        style={{ maxWidth: '400px' }}
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        readOnly={details?.isIntegration}
                    />
                    <FormText>A brief description of the payment method</FormText>
                </FormGroup>
                <FormGroup>
                    <Label>Instructions *</Label>
                    <Input
                        style={{ maxWidth: '800px' }}
                        type="textarea"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows="8"
                        disabled={loading}
                        readOnly={details?.isIntegration}
                    />
                    <FormText>
                        Outline the process that clients must follow to successfully complete a
                        payment using this method.
                    </FormText>
                </FormGroup>
                <FormGroup check>
                    <Label check>Is Archived</Label>
                    <Input
                        type="checkbox"
                        checked={isArchived}
                        onChange={(e) => setIsArchived(e.target.checked)}
                        disabled={loading || details?.isIntegration}
                    />
                </FormGroup>
            </PageBody>
        </>
    );
};

export default connect(
    (state) => ({
        loading: state.billing?.loading,
        details: state.billing?.paymentMethodDetails,
    }),
    {
        getData: actions.fetchPaymentMethodDetails,
        doUpdate: actions.updatePaymentMethod,
        initializeAddition: actions.initializePaymentMethod,
        doAdd: actions.createPaymentMethod,
        doDelete: actions.deletePaymentMethod,
    }
)(PaymentMethodSetup);
