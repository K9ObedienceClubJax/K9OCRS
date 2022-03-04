import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader/index';
import { Spinner } from 'reactstrap';
import Table from '../../../shared/components/Table/index';
import columns from './columns';
import * as accountsApi from '../../../util/apiClients/userAccounts';

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableConfig = {
    getSubRows: (row) => row?.users?.map((u) => ({ userId: u.id, ...u })),
    autoResetExpanded: false,
  };

  async function getUsers(setUsers, setLoading, role) {
    const response = await accountsApi.queryUsers(role);
    setUsers(response);
    setLoading(false);
  }

  useEffect(() => {
    getUsers(setUsers, setLoading, '0');
    const radio = document.getElementById('option0');
    radio.checked = true;
  }, []); // eslint-disable-line

  return (
    <div>
      <PageHeader
        title='Manage Users'
        breadCrumbItems={[
          { label: 'Management', path: '/Manage' },
          { label: 'Users', active: true },
        ]}
      >
        <Button tag={Link} to='/Manage/Users/Create' color='primary'>
          Create a User
        </Button>
      </PageHeader>
      <div className=' mx-auto text-center mt-3'>
        <div className='btn-group'>
          <input
            type='radio'
            className='btn-check'
            name='role'
            value='0'
            id='option0'
            onChange={(e) =>
              getUsers(setUsers, setLoading, e.currentTarget.value)
            }
          />
          <label className='btn btn-outline-secondary' htmlFor='option0'>
            All
          </label>
          <input
            type='radio'
            className='btn-check'
            name='role'
            value='4'
            id='option4'
            onChange={(e) =>
              getUsers(setUsers, setLoading, e.currentTarget.value)
            }
          />
          <label className='btn btn-outline-secondary' htmlFor='option4'>
            Non-Member
          </label>

          <input
            type='radio'
            className='btn-check'
            name='role'
            value='3'
            id='option3'
            onChange={(e) =>
              getUsers(setUsers, setLoading, e.currentTarget.value)
            }
          />
          <label className='btn btn-outline-secondary' htmlFor='option3'>
            Member
          </label>

          <input
            type='radio'
            className='btn-check'
            name='role'
            value='2'
            id='option2'
            onChange={(e) =>
              getUsers(setUsers, setLoading, e.currentTarget.value)
            }
          />
          <label className='btn btn-outline-secondary' htmlFor='option2'>
            Instructor
          </label>

          <input
            type='radio'
            className='btn-check'
            name='role'
            value='1'
            id='option1'
            onChange={(e) =>
              getUsers(setUsers, setLoading, e.currentTarget.value)
            }
          />
          <label className='btn btn-outline-secondary' htmlFor='option1'>
            Admin
          </label>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          columns={columns}
          data={users}
          tableConfig={tableConfig}
          pageSize={12}
          withPagination
        />
      )}
    </div>
  );
};

export default Users;
