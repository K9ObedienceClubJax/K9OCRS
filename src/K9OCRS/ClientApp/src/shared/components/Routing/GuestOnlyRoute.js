import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import selectors from '../../modules/selectors';

const GuestOnlyRoute = (props) => {
    const { currentUser, children } = props;

    // If the user is not logged in.
    if (currentUser) {
        return <Navigate to="/" />;
    }

    // if the user is logged in and has enough access for this route.
    return children;
};

GuestOnlyRoute.defaultProps = {
    currentUser: null,
};

GuestOnlyRoute.propTypes = {
    currentUser: PropTypes.object,
    children: PropTypes.any.isRequired,
};

export default connect((state) => ({
    currentUser: selectors.selectCurrentUser(state),
}))(GuestOnlyRoute);
