import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const GuestOnlyRoute = props => {
  const {
    currentUser,
  } = props;

  // If the user is not logged in.
  if (currentUser) {
    return <Redirect to="/" />;
  }

  // if the user is logged in and has enough access for this route.
  return <Route {...props} />;
};

GuestOnlyRoute.defaultProps = {
  currentUser: null,
};

GuestOnlyRoute.propTypes = {
  currentUser: PropTypes.object,
};

export default connect(state => ({
  currentUser: state.shared.currentUser,
}))(GuestOnlyRoute);
