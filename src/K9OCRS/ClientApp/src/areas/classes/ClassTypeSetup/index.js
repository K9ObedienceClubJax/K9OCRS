import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import ClassTypeEditor from './ClassTypeEditor';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';

import './styles.scss';

const ClassTypeSetup = (props) => {
    const { classType, fetchClassDetails } = props;

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [data, setData] = useState(null);

    const { classTypeId } = useParams();

    const addingNewType = !classTypeId;

    useEffect(() => {
        if (!addingNewType) {
            fetchClassDetails({ classTypeId, setLoading, setAlerts });
        }
    }, [classTypeId]); // eslint-disable-line

    const cn = 'classTypeSetup';

    return (
        <div className={cn}>
            <PageHeader
                title={`Class Type: ${classType?.title ?? 'Loading...'}`}
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Classes', path: '/Manage/Classes' },
                    {
                        label: `Class Type: ${
                            classType?.title ?? 'Loading...'
                        }`,
                        active: true,
                    },
                ]}
                alerts={alerts}
                setAlerts={setAlerts}
            >
                <Button
                    tag={Link}
                    to="/Manage/Classes"
                    color="secondary"
                    outline
                >
                    Cancel
                </Button>
                <Button onClick={() => {}} color="primary">
                    Save Changes
                </Button>
            </PageHeader>
            {loading ? (
                <Spinner />
            ) : (
                <ClassTypeEditor
                    classType={classType}
                    setData={setData}
                    addingNewType={addingNewType}
                />
            )}
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </div>
    );
};

export default connect(
    (state) => ({
        classType: state.classes?.classDetails,
    }),
    {
        fetchClassDetails: actions.fetchClassDetails,
    }
)(ClassTypeSetup);
