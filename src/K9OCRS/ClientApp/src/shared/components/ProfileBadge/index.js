import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';

import './styles.scss';

const ProfileBadge = (props) => {
    const { className, id, imageUrl, fullName, firstName, lastName, link, isDog } = props;

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

    const content = (
        <>
            <Avatar imageUrl={imageUrl} />
            <span className={`${cn}__name`}>
                {fullName ? fullName : `${firstName} ${lastName}`}
            </span>
        </>
    );

    if (link) {
        return (
            <Link className={topCn} to={linkPath}>
                {content}
            </Link>
        );
    }

    return <div className={topCn}>{content}</div>;
};

ProfileBadge.defaultProps = {
    className: '',
    id: null,
    link: false,
    isDog: false,
    fullName: '',
    firstName: '',
    lastName: '',
};

ProfileBadge.propTypes = {
    className: PropTypes.string,
    id: PropTypes.number,
    imageUrl: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    link: PropTypes.bool,
    isDog: PropTypes.bool,
};

export default ProfileBadge;
