import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLES, isAtLeast } from '../../../util/accessEvaluator';
import selectors from '../../modules/selectors';

const ProtectedRoute = (props) => {
    const { currentUser, minimumAccess, children } = props;

    // If the user is not logged in.
    if (!currentUser) {
        return <Navigate to="/Account/Login" />;
    }
    // if the user is logged in but their user has less access than needed for this route.
    // The lower the value of the role id, the higher the access. So our check is inverted ¯\_(ツ)_/¯
    else if (minimumAccess && !isAtLeast(currentUser, minimumAccess)) {
        return <Navigate to="/" />;
    }

    // if the user is logged in and has enough access for this route.
    return children;
};

ProtectedRoute.defaultProps = {
    currentUser: null,
    minimumAccess: null,
};

ProtectedRoute.propTypes = {
    children: PropTypes.any.isRequired,
    currentUser: PropTypes.object,
    minimumAccess: PropTypes.oneOf(Object.values(USER_ROLES)),
};

export default connect((state) => ({
    currentUser: selectors.selectCurrentUser(state),
}))(ProtectedRoute);
