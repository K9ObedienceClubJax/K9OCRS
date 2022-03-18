import React from 'react';
import PropTypes from 'prop-types';
import { BsXCircleFill } from 'react-icons/bs';

import './styles.scss';

const FileThumbnail = (props) => {
    const { src, alt, file, removable, handleRemove } = props;

    const cn = 'file-thumbnail';

    return (
        <div className={cn}>
            {removable ? (
                <BsXCircleFill
                    className={`${cn}__remove`}
                    onClick={handleRemove}
                />
            ) : null}
            <img
                src={file ? URL.createObjectURL(file) : src}
                alt={`Thumbnail of ${file?.path || alt}`}
            />
        </div>
    );
};

FileThumbnail.defaultProps = {
    src: null,
    alt: null,
    file: null,
    removable: false,
    handleRemove: () => {},
};

FileThumbnail.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    file: PropTypes.instanceOf(File),
    removable: PropTypes.bool,
    handleRemove: PropTypes.func,
};

export default FileThumbnail;
