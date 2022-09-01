import React, { useEffect } from 'react';
import numbro from 'numbro';
import { useDropzone } from 'react-dropzone';
import { BsCloudUpload } from 'react-icons/bs';
import FileThumbnail from '../FileThumbnail';

import './styles.scss';

const FileDropzone = (props) => {
    const { accept, acceptText, maxFiles, maxSize, onChange, bordered } = props;

    const numericMaxSize = numbro.unformat(maxSize);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept,
        maxFiles,
        maxSize: maxSize ? numericMaxSize : null,
    });

    useEffect(() => {
        if (onChange) {
            onChange(acceptedFiles);
        }
    }, [onChange, acceptedFiles]);

    const cn = 'fileDropZone';

    const files = acceptedFiles.map((file) => (
        <FileThumbnail
            key={file.path}
            file={file}
            data={{
                filename: file.name,
            }}
        />
    ));
    return (
        <section className={`${cn}-container${bordered ? '--bordered' : ''}`}>
            <div {...getRootProps({ className: cn })}>
                <input {...getInputProps()} />
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
            <aside>
                <h4>Selected Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
};

FileDropzone.defaultProps = {
    accept: 'image/jpeg,image/png,image/bmp',
    acceptText: 'jpg, png, bmp',
    maxFiles: null,
    maxSize: null,
    onChange: null,
};

export default FileDropzone;
