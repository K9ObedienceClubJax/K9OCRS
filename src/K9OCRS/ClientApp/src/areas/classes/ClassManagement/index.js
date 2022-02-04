import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader';
import ClassTypeCard from './ClassTypeCard';
import CardGrid from '../../../shared/components/CardGrid';
import * as actions from '../modules/actions';

const ClassManagement = props => {
  const {
    classesState: {
      classList,
    },
    fetchClassList,
  } = props;

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchClassList({ setLoading, setAlerts });
  }, []); // eslint-disable-line

  const emptyStateComponent = useMemo(() => (
    <p>There's no Class Types to show at the moment. Lets <Link to="/Manage/ClassTypes/Add">add the first one</Link>!</p>
  ), []);

  const items = useMemo(() => classList?.length > 0 ? classList.map(classItem => (
    <ClassTypeCard key={classItem.id} {...classItem} />
  )) : [], [JSON.stringify(classList)]); // eslint-disable-line

  return (
    <div>
      <PageHeader
        title="Class Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Classes', active: true },
        ]}
        alerts={alerts}
      >
        <Button tag={Link} to="/Manage/ClassTypes/Add" color="primary">Add a Type</Button>
        <Button tag={Link} to="/Manage/ClassSections/Add" color="primary">Add a Section</Button>
      </PageHeader>
      <CardGrid
        loading={loading}
        errored={alerts?.length > 0}
        emptyStateComponent={emptyStateComponent}
        items={items}
      />
    </div>
  );
};

export default connect(state => ({
  classesState: state.classes,
}),{
  fetchClassList: actions.fetchClassList,
})(ClassManagement);
