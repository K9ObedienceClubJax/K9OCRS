import React from 'react';
import './style.css';

const FileUploadModal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? 'modal d-block' : 'modal d-none';

    return (
        <div className={showHideClassName}>
            <div className="modal-container">
                {children}
                <p className="modal-close" onClick={handleClose}>
                    close
                </p>
            </div>
        </div>
    );
};

export default FileUploadModal;
