import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { Button, Container, Row, Spinner } from "reactstrap";
import * as classTypesClient from '../../../util/apiClients/classTypes';
import ClassTypeCard from '../../../shared/components/ClassTypeCard';
import CustomPagination from '../../../shared/components/Pagination';
import CourseDisplay from "./CourseDisplay";
import Search from "./Search";

const Courses = () => {
  const itemsPerPage = 8;

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [page, setPage] = useState(1);

  // Calculate the start and end of our paginated subset of class types
  const pageStartIndex = (page - 1) * itemsPerPage;
  const pageEndIndex = page * itemsPerPage;

  
  let [query, setQuery] = useState("");

  const filteredClasses = classTypes.filter((item) => {
    return (
      item.title.toLowerCase().includes(query.toLowerCase) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  });

  // Slice the data up to the max amount of items per page
  const visibleClassTypes = filteredClasses?.slice(pageStartIndex, pageEndIndex);


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
      <h3>Available Classes</h3>
      <Container className="px-lg-5" fluid>
        { loading && <Spinner /> }
        { loading || alerts?.length > 0 ? null : (
          <>
          <Search query={query} onQueryChange={(myquery) => setQuery(myquery)} />
          <Row className="my-4">
            {
              visibleClassTypes?.length > 0 ? filteredClasses.map(ct => (
                <ClassTypeCard key={ct.id} {...ct} />
              )) : <p>There's no Class Types to show at the moment. Lets <Link to="/Manage/ClassTypes/Add">add the first one</Link>!</p>
            }
          </Row>
          </>
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

export default Courses;
