import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Avatar from '../Avatar';

import './styles.scss';

const ProfileBadge = (props) => {
    const { className, id, imageUrl, firstName, lastName, link } = props;

    const history = useHistory();
    const userSetupPath = `/Manage/Users/${id}`;

    const cn = 'profileBadge';

    const topCn = classNames(
        cn,
        {
            'profileBadge--clickable': link,
        },
        className
    );

    return (
        <div className={topCn} onClick={link ? () => history.push(userSetupPath) : undefined}>
            <Avatar imageUrl={imageUrl} />
            <span className={`${cn}__name`}>{`${firstName} ${lastName}`}</span>
        </div>
    );
};

ProfileBadge.defaultProps = {
    className: '',
    id: null,
    link: false,
};

ProfileBadge.propTypes = {
    className: PropTypes.string,
    id: PropTypes.number,
    imageUrl: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    link: PropTypes.bool,
};

export default ProfileBadge;
