import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Spinner } from 'reactstrap';
import PageHeader from 'src/shared/components/PageHeader';
import * as actions from '../modules/actions';
import columns from './columns';
import Table from 'src/shared/components/Table';

import PageBody from 'src/shared/components/PageBody';

const PaymentMethodsManagement = (props) => {
    const { loading, includeArchived, paymentMethods, toggleIncludeArchived, fetchPaymentMethods } =
        props;

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchPaymentMethods({ setAlerts });
    }, [includeArchived, fetchPaymentMethods, setAlerts]);

    return (
        <div className="paymentMethodsManagement">
            <PageHeader
                title="Manage Payment Methods"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Payment Methods', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button tag={Link} to="/Manage/PaymentMethods/Add" color="primary">
                    Add a Payment Method
                </Button>
            </PageHeader>
            <PageBody>
                <div className="d-flex justify-content-center justify-content-sm-end">
                    <FormGroup className="me-5" check>
                        <Input
                            type="checkbox"
                            checked={includeArchived}
                            onChange={() => toggleIncludeArchived()}
                            disabled={loading}
                        />
                        <Label check>Show Archived</Label>
                    </FormGroup>
                </div>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    <Table columns={columns} data={paymentMethods} pageSize={12} withPagination />
                )}
                <p className="text-muted">
                    <b>Note on payment method types:</b> <u>Manual</u> payment methods can be
                    managed through the site. However, <u>Integrations</u> can only be modified by a
                    developer.
                </p>
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        loading: state.billing.loading,
        includeArchived: state.billing.includeArchived,
        paymentMethods: state.billing.paymentMethodsList,
    }),
    {
        toggleIncludeArchived: actions.toggledIncludeArchived,
        fetchPaymentMethods: actions.fetchPaymentMethods,
    }
)(PaymentMethodsManagement);
