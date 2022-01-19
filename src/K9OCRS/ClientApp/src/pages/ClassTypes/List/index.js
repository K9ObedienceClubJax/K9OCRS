import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Spinner } from 'reactstrap';
import * as classTypesClient from '../../../util/apiClients/classTypes';
import PageHeader from '../../../shared/components/PageHeader';
import ClassTypeCard from './ClassTypeCard';
import CustomPagination from '../../../shared/components/Pagination';

const ClassTypesList = () => {
  const itemsPerPage = 8;

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [page, setPage] = useState(1);

  // Calculate the start and end of our paginated subset of class types
  const pageStartIndex = (page - 1) * itemsPerPage;
  const pageEndIndex = page * itemsPerPage;

  // Slice the data up to the max amount of items per page
  const visibleClassTypes = classTypes?.slice(pageStartIndex, pageEndIndex);

  useEffect(() => {
    async function getTest() {
      try {
        const res = await classTypesClient.getAllClassTypes();
        setClassTypes(res?.data);
        setLoading(false);
      } catch(err) {
        setLoading(false);
        setAlerts([{ color: 'danger', message: 'We\'re having issues retrieving the list of class types.' }]);
      }
    }
    getTest();
  }, []);

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
          totalCount={classTypes?.length}
          currentPage={page}
          pageSize={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ClassTypesList;
