import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader/index';
import { Spinner } from 'reactstrap';
import Table from '../../../shared/components/Table/index';
import columns from './columns';
import * as accountsApi from '../../../util/apiClients/userAccounts';
import PageBody from '../../../shared/components/PageBody';
import { USER_ROLES } from '../../../util/accessEvaluator';

const Users = (props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const tableConfig = {
        getSubRows: (row) => row?.users?.map((u) => ({ userId: u.id, ...u })),
        autoResetExpanded: false,
    };

    async function getUsers(setUsers, setLoading, role) {
        const response = await accountsApi.queryUsers(role, true);
        setUsers(response);
        setLoading(false);
    }

    useEffect(() => {
        getUsers(setUsers, setLoading, '0');
        const radio = document.getElementById('option0');
        radio.checked = true;
    }, []); // eslint-disable-line

    const userRoleRadios = [];

    for (const [key, value] of Object.entries(USER_ROLES)) {
        userRoleRadios.push(
            <>
                <input
                    key={`${key}_input`}
                    type="radio"
                    className="btn-check"
                    name="role"
                    value={value}
                    id={key}
                    disabled={loading}
                    onChange={(e) => getUsers(setUsers, setLoading, e.currentTarget.value)}
                />
                <label key={`${key}_label`} className="btn btn-outline-secondary" htmlFor={key}>
                    {key}
                </label>
            </>
        );
    }

    userRoleRadios.reverse();

    return (
        <div>
            <PageHeader
                title="Manage Users"
                breadCrumbItems={[
                    { label: 'Management', path: '/Manage' },
                    { label: 'Users', active: true },
                ]}
            >
                <Button tag={Link} to="/Manage/Users/Create" color="primary">
                    Create a User
                </Button>
            </PageHeader>
            <PageBody>
                <div className=" mx-auto text-center mt-3">
                    <div className="btn-group">
                        <input
                            type="radio"
                            className="btn-check"
                            name="role"
                            value="0"
                            id="option0"
                            disabled={loading}
                            onChange={(e) => getUsers(setUsers, setLoading, e.currentTarget.value)}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="option0">
                            All
                        </label>
                        {userRoleRadios}
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
            </PageBody>
        </div>
    );
};

export default Users;
