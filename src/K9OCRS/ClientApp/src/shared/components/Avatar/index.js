import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const Avatar = props => {
  const { imageUrl, size } = props;

  const cn = 'avatar';

  const imgSize = `${size}rem`;
  const containerSize = `${size + 0.5}rem`;

  return (
    <div
      className={`${cn}__image-container`}
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      <img
        className={`${cn}__image`}
        src={imageUrl}
        alt="user profile"
        style={{
          width: imgSize,
          height: imgSize,
        }}
      />
    </div>
  );
};

Avatar.defaultProps = {
  size: 2,
};

Avatar.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Avatar;
