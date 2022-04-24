import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../shared/modules/actions';
import { Container, Spinner } from 'reactstrap';
import NavBar from './NavBar';
import SiteBanner from './SiteBanner';
import selectors from '../modules/selectors';

const Layout = (props) => {
    const { currentUser, refreshingUser, refreshLogin } = props;
    //static displayName = Layout.name;

    useEffect(() => {
        if (!currentUser) {
            refreshLogin();
        }
    }, [currentUser]); // eslint-disable-line

    const navbarElement = document.querySelector('.k9-navbar');
    const navbarHeight = navbarElement ? window.getComputedStyle(navbarElement).height : '56px';

    // set custom css variable on root
    document.documentElement.style.setProperty('--navbar-height', navbarHeight);

    return (
        <>
            <NavBar />
            <SiteBanner />
            <Container className="siteContent px-4 px-md-5" fluid>
                {!refreshingUser ? props.children : <Spinner />}
            </Container>
        </>
    );
};

export default connect(
    (state) => ({
        refreshingUser: selectors.selectRefreshingUser(state),
        currentUser: selectors.selectCurrentUser(state),
    }),
    { refreshLogin: actions.refreshLogin }
)(Layout);
