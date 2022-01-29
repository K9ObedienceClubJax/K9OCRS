import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Spinner } from 'reactstrap';
import PageHeader from '../../../../shared/components/PageHeader';
import ClassTypeCard from './ClassTypeCard';
import CustomPagination from '../../../../shared/components/Pagination';
import * as actions from '../../modules/actions';

const ClassTypesList = props => {
  const {
    classTypesState: {
      classList,
    },
    fetchClassList,
  } = props;

  const itemsPerPage = 8;

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const [page, setPage] = useState(1);

  // Calculate the start and end of our paginated subset of class types
  const pageStartIndex = (page - 1) * itemsPerPage;
  const pageEndIndex = page * itemsPerPage;

  // Slice the data up to the max amount of items per page
  const visibleClassTypes = classList?.slice(pageStartIndex, pageEndIndex);

  useEffect(() => {
    fetchClassList({ setLoading, setAlerts });
  }, [fetchClassList]);

  return (
    <div>
      <PageHeader
        title="Class Types Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Class Types', active: true },
        ]}
        alerts={alerts}
      >
        <Button tag={Link} to="/Manage/ClassTypes/Add" color="primary">Add a Class Type</Button>
      </PageHeader>
      <Container className="px-lg-5" fluid>
        { loading && <Spinner /> }
        { loading || alerts?.length > 0 ? null : (
          <Row className="my-4">
            {
              visibleClassTypes?.length > 0 ? visibleClassTypes.map(ct => (
                <ClassTypeCard key={ct.id} {...ct} />
              )) : <p>There's no Class Types to show at the moment. Lets <Link to="/Manage/ClassTypes/Add">add the first one</Link>!</p>
            }
          </Row>
        )}
      </Container>
      <div className="d-flex justify-content-end px-4 px-lg-5">
        <CustomPagination
          onPageChange={setPage}
          totalCount={classList?.length}
          currentPage={page}
          pageSize={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default connect(state => ({
  classTypesState: state.classes.classTypesManagement,
}),{
  fetchClassList: actions.fetchClassList,
})(ClassTypesList);
