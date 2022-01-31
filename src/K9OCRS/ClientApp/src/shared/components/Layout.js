import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../shared/modules/actions';
import { Container } from 'reactstrap';
import NavBar from './NavBar';
import SiteBanner from './SiteBanner';

const Layout = (props) => {
  const { currentUser, refreshLogin } = props;
  //static displayName = Layout.name;

  useEffect(() => {
    if (!currentUser) {
      refreshLogin();
    }
  }, [currentUser]);

  {
    return (
      <div>
        <NavBar />
        <SiteBanner />
        <Container className='px-4 px-md-5' fluid>
          {props.children}
        </Container>
      </div>
    );
  }
};

export default connect(
  (state) => ({
    currentUser: state.shared.currentUser,
  }),
  { refreshLogin: actions.refreshLogin }
)(Layout);
