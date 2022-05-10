import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Button } from 'reactstrap';
import { BsCloudDownload } from 'react-icons/bs';
import PageHeader from '../../../shared/components/PageHeader';
import PageBody from '../../../shared/components/PageBody';

export default function ManagementDashboard() {
    return (
        <div>
            <PageHeader>
                <Button
                    tag="a"
                    href="api/reporting/export"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    outline
                >
                    Export Data
                    <BsCloudDownload className="ms-2" size="1.5rem" />
                </Button>
                {/* <Button disabled outline>
                    Import Data
                    <BsCloudUpload className="ms-2" size="1.5rem" />
                </Button> */}
            </PageHeader>
            <PageBody>
                <h2>Management Areas</h2>
                <p>The look of this page will change soon</p>
                <Nav>
                    <NavItem>
                        <NavLink tag={Link} to="/Manage/Classes">
                            Class Management
                        </NavLink>
                        <NavLink tag={Link} to="/Manage/Users">
                            Users Management
                        </NavLink>
                        <NavLink tag={Link} to="/Manage/Dogs">
                            Dogs Management
                        </NavLink>
                        <NavLink tag={Link} to="/Manage/Applications">
                            Applications Management
                        </NavLink>
                        <NavLink tag={Link} to="/Manage/PaymentMethods">
                            Payment Methods Management
                        </NavLink>
                    </NavItem>
                </Nav>
            </PageBody>
        </div>
    );
}
