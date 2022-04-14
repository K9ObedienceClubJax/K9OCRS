import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Spinner } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';
import columns from './columns';
import Table from '../../../shared/components/Table';

import './styles.scss';
import PageBody from '../../../shared/components/PageBody';

const ClassManagement = (props) => {
    const {
        classesState: { includeArchived, includeDrafts, classList },
        fetchClassList,
        toggleIncludeArchived,
        toggleIncludeDrafts,
    } = props;

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState((c) => c, []);

    const tableConfig = {
        getSubRows: (row) => row?.sections?.map((s) => ({ sectionId: s.id, ...s })),
        autoResetExpanded: false,
    };

    useEffect(() => {
        fetchClassList({ includeArchived, includeDrafts, setLoading, setAlerts });
    }, [fetchClassList, includeArchived, includeDrafts, setLoading, setAlerts]);

    return (
        <div className="classManagementPage">
            <PageHeader
                title="Class Management"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Classes', active: true },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button tag={Link} to="/Manage/Classes/Types/Add" color="primary">
                    Add a Type
                </Button>
                <Button tag={Link} to="/Manage/Classes/Sections/Add" color="primary">
                    Add a Section
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
                        <Label check>Show Archived Types</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Input
                            type="checkbox"
                            checked={includeDrafts}
                            onChange={() => toggleIncludeDrafts()}
                            disabled={loading}
                        />
                        <Label check>Show Drafted Sections</Label>
                    </FormGroup>
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <Table
                        columns={columns}
                        data={classList}
                        tableConfig={tableConfig}
                        pageSize={12}
                        footnotes={['* This is the usual meeting time, but it may vary']}
                        expandable
                        withPagination
                    />
                )}
            </PageBody>
        </div>
    );
};

export default connect(
    (state) => ({
        classesState: state.classes,
    }),
    {
        fetchClassList: actions.fetchClassList,
        toggleIncludeArchived: actions.toggledIncludeArchived,
        toggleIncludeDrafts: actions.toggledIncludeDrafts,
    }
)(ClassManagement);
