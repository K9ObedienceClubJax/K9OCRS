import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';

import './styles.scss';

const ProfileBadge = (props) => {
    const { className, id, imageUrl, fullName, firstName, lastName, link, isDog } = props;

    const navigate = useNavigate();
    const userSetupPath = `/Manage/Users/${id}`;
    const dogsSetupPath = `/Manage/Dogs/${id}`;

    const linkPath = isDog ? dogsSetupPath : userSetupPath;

    const cn = 'profileBadge';

    const topCn = classNames(
        cn,
        {
            'profileBadge--clickable': link,
        },
        className
    );

    return (
        <div className={topCn} onClick={link ? () => navigate(linkPath) : undefined}>
            <Avatar imageUrl={imageUrl} />
            <span className={`${cn}__name`}>{fullName ? fullName : `${firstName} ${lastName}`}</span>
        </div>
    );
};

ProfileBadge.defaultProps = {
    className: '',
    id: null,
    link: false,
    isDog: false,
};

ProfileBadge.propTypes = {
    className: PropTypes.string,
    id: PropTypes.number,
    imageUrl: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    link: PropTypes.bool,
    isDog: PropTypes.bool,
};

export default ProfileBadge;
