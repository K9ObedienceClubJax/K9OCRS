import React from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import PageHeader from '../../sharedComponents/PageHeader';
import ClassTypeGrid from './ClassTypeGrid';

const ClassTypesDashboard = () => {
  // const [test, setTest] = useState([]);
  // useEffect(() => {
  //   async function getTest() {
  //     try {
  //       const res = await axios.get('/api/classtypes');
  //       console.log(res);
  //       setTest(res?.data);
  //     } catch(err) {
  //       console.log(err?.response);
  //       setTest(err?.response?.data);
  //     }
  //   }
  //   getTest();
  // }, []);

  return (
    <div>
      <PageHeader
        title="Class Types Management"
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Class Types', active: true }
        ]}
      >
        <Button tag={Link} to="/Manage/ClassTypes/Add" color="primary">Add a Class Type</Button>
      </PageHeader>
      {/* <pre>{JSON.stringify(test, null, 2)}</pre> */}
      <ClassTypeGrid />
    </div>
  );
};

export default ClassTypesDashboard;
