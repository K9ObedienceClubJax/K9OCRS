import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import PageHeader from '../../../shared/components/PageHeader';
import * as actions from '../modules/actions';
import columns from './columns';
import Table from '../../../shared/components/Table';

import './styles.scss';

const ClassManagement = props => {
  const {
    classesState: {
      classList,
    },
    fetchClassList,
  } = props;

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState(c => c,[]);

  const tableConfig = {
    getSubRows: row => row?.sections?.map(s => ({ sectionId: s.id, ...s })),
    autoResetExpanded: false,
  };

  useEffect(() => {
    fetchClassList({ setLoading, setAlerts });
  }, []); // eslint-disable-line

  return (
    <div className='classManagementPage'>
      <PageHeader
        title="Class Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Classes', active: true },
        ]}
        alerts={alerts}
      >
        <Button tag={Link} to="/Manage/Classes/Types/Add" color="primary">Add a Type</Button>
        <Button tag={Link} to="/Manage/Classes/Sections/Add" color="primary">Add a Section</Button>
      </PageHeader>
      { loading ? <Spinner /> : (
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
    </div>
  );
};

export default connect(state => ({
  classesState: state.classes,
}),{
  fetchClassList: actions.fetchClassList,
})(ClassManagement);
