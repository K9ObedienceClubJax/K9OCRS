import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../shared/modules/actions';
import { Container } from 'reactstrap';
import NavBar from './NavBar';
import SiteBanner from './SiteBanner';
import selectors from '../modules/selectors';

const Layout = (props) => {
  const { currentUser, refreshLogin } = props;
  //static displayName = Layout.name;

  useEffect(() => {
    if (!currentUser) {
      refreshLogin();
    }
  }, [currentUser]); // eslint-disable-line

  return (
    <div>
      <NavBar />
      <SiteBanner />
      <Container className='px-4 px-md-5' fluid>
        {props.children}
      </Container>
    </div>
  );
};

export default connect(
  (state) => ({
    currentUser: selectors.selectCurrentUser(state),
  }),
  { refreshLogin: actions.refreshLogin }
)(Layout);
