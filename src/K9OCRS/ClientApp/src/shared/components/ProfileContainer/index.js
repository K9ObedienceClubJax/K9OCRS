import React from 'react';
import FileUploadModal from '../FileUploadModal';
import ProfileFileDropzone from '../FileDropzone/Profile';
import './style.css';

const ProfileContainer = (props) => {
    const {
        modal,
        setModal,
        setImageToUpdate,
        currentUser,
        picture,
        // setPicture,
    } = props;
    return (
        <div className="d-flex container">
            <img
                className="mx-auto profile-picture"
                alt="profile"
                src={picture}
            />
            <div
                className="overlay mx-auto"
                onClick={(e) => setModal(true)}
            ></div>
            <FileUploadModal show={modal} handleClose={(e) => setModal(false)}>
                <ProfileFileDropzone
                    maxSize="5MB"
                    maxFiles={1}
                    onChange={(files) => {
                        setImageToUpdate(files[0]);
                    }}
                    currentImage={currentUser.profilePictureUrl}
                />
            </FileUploadModal>
        </div>
    );
};

export default ProfileContainer;
