import React, { useEffect, useMemo, useState } from 'react';
import numbro from 'numbro';
import { useDropzone } from 'react-dropzone';
import { BsCloudUpload } from 'react-icons/bs';

import './styles.scss';

const ProfileFileDropzone = (props) => {
    const { accept, acceptText, maxFiles, maxSize, onChange, currentImage, round, setPicture } =
        props;

    const numericMaxSize = numbro.unformat(maxSize);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept,
        maxFiles,
        maxSize: maxSize ? numericMaxSize : null,
        onDropAccepted: (files) => updateDisplayProfile(files),
    });

    const selectedFilesString = JSON.stringify(acceptedFiles);

    useEffect(() => {
        if (onChange) {
            onChange(acceptedFiles);
        }
    }, [onChange, acceptedFiles, selectedFilesString]);

    const cn = 'fileDropZone-profile';

    // If this isn't memoized, the image will flicker
    // everytime the component re-renders
    const imageUrl = useMemo(() => {
        let result = acceptedFiles[0]
            ? `url(${URL.createObjectURL(acceptedFiles[0])})`
            : `url(${currentImage})`;
        // setPicture(result);
        return result;
    }, [acceptedFiles, currentImage]);

    function updateDisplayProfile(files) {
        if (files?.length > 0) {
            let result = files[0] ? `${URL.createObjectURL(files[0])}` : `${currentImage}`;
            setPicture(result);
        }
    }

    return (
        <div
            {...getRootProps({
                className: `${cn} ${round ? `${cn}--round` : ''}`,
            })}
            style={{
                backgroundImage: imageUrl,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <input {...getInputProps()} multiple={!maxFiles || maxFiles > 1} />
            <div className={`${cn}__overlay`}>
                <BsCloudUpload className={`${cn}__icon`} />
                <div className={`${cn}__cta-container`}>
                    <p className={`${cn}__cta`}>
                        Drag 'n' drop some files here, or click to select files
                    </p>
                    <span className={`${cn}__accept-text`}>
                        <strong>Allowed formats:</strong> {acceptText}
                    </span>
                    {maxSize ? (
                        <span className={`${cn}__accept-text`}>
                            <strong>Max file size:</strong> {maxSize}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

ProfileFileDropzone.defaultProps = {
    accept: 'image/jpeg,image/png,image/bmp',
    acceptText: 'jpg, png, bmp',
    maxFiles: null,
    maxSize: null,
    onChange: null,
    currentImage: null,
};

export default ProfileFileDropzone;
