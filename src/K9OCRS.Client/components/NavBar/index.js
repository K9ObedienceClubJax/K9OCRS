import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { commonSelectors } from 'pages/selectors';
import { SITEMAP_NAVBAR } from 'app/sitemap';
import * as actions from 'app/modules/actions';

import './style.scss';

const NavBar = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(commonSelectors.selectIsAuthenticated);

  const handleLogout = () => dispatch(actions.logout());

  return (
    <Navbar fixed="top" expand="md" className="k9ocrs-navbar">
      <Container fluid className="pl-5 pr-5">
        <Navbar.Brand>
          K9 Obedience Club Registration System
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <Nav>
            {
              Object.values(SITEMAP_NAVBAR).map((page, index) => {
                const show = page.authRequired ? isAuthenticated : true;
                return show ? (
                  <LinkContainer key={index} to={page.path} exact={page.exact}>
                    <Nav.Link eventKey={page.path}>{page.name.toUpperCase()}</Nav.Link>
                  </LinkContainer>
                ) : null;
              })
            }
          </Nav>
          <div>
            {
              isAuthenticated && (
                <Button variant="secondary" onClick={handleLogout}>LOGOUT</Button>
              )
            }
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;