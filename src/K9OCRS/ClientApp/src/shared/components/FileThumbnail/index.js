import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { getZonedMoment } from 'src/util/dates';
import {
    BsXCircleFill,
    BsCheckCircle,
    BsExclamationCircle,
    BsDashCircle,
    BsFileEarmarkTextFill,
} from 'react-icons/bs';
import { testImageFilename } from 'src/util/files';

import './styles.scss';

const FileThumbnail = (props) => {
    const { src, data, alt, file, removable, handleRemove, handleClick, showApprovalStatus } = props;

    const cn = 'file-thumbnail';

    const approvalStatus = data?.expireDate ? getZonedMoment(data?.expireDate).isSameOrAfter() : null;

    const approvalCn = ClassNames(
        `${cn}__approval`,
        {
            '--approved': approvalStatus === true,
            '--denied': approvalStatus === false,
        }
    );

    let approvalIcon = <BsDashCircle className={approvalCn} />;

    if (approvalStatus === true) {
        approvalIcon = <BsCheckCircle className={approvalCn} />;
    } else if (approvalStatus === false) {
        approvalIcon = <BsExclamationCircle className={approvalCn} />;
    }

    const noImage = !testImageFilename(data?.filename);

    return (
        <div className={cn}>
            {removable ? (
                <BsXCircleFill
                    className={`${cn}__remove`}
                    onClick={handleRemove}
                />
            ) : null}
            {showApprovalStatus ? approvalIcon : null}
            <div
                className={`${cn}__content ${handleClick === null ? '' : '--clickable'}`}
                onClick={() => handleClick(data)}
            >
                {noImage
                    ? <BsFileEarmarkTextFill className={`${cn}__file-icon`} />
                    : <img
                        src={file ? URL.createObjectURL(file) : src}
                        alt={`Thumbnail of ${file?.path || alt}`}
                    />}
            </div>
            <span>{data.filename}</span>
        </div>
    );
};

FileThumbnail.defaultProps = {
    src: null,
    data: null,
    alt: null,
    file: null,
    removable: false,
    showApprovalStatus: false,
    handleRemove: () => {},
    handleClick: null,
};

FileThumbnail.propTypes = {
    src: PropTypes.string,
    data: PropTypes.object,
    alt: PropTypes.string,
    file: PropTypes.instanceOf(File),
    removable: PropTypes.bool,
    showApprovalStatus: PropTypes.bool,
    handleRemove: PropTypes.func,
    handleClick: PropTypes.func,
};

export default FileThumbnail;
