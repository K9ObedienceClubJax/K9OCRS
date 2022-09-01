import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    Label,
    FormText,
} from 'reactstrap';

const RecordOptionsModal = (props) => {
    const {
        data,
        open,
        handleClose,
        allowReview,
        handleSubmitRecordReview,
    } = props;

    const [expirationDate, setExpirationDate] = useState();
    const [fieldEntered, setFieldEntered] = useState(false);
    const [fieldError, setFieldError] = useState('');

    const dataString = JSON.stringify(data);

    // Populate fields if we get data
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setExpirationDate(
                data?.expireDate ? moment(data?.expireDate).format('YYYY-MM-DD') : ''
            );
            setFieldEntered(false);
        }

        return () => {
            isMounted = false;
        };
    }, [dataString]); // eslint-disable-line

    const handleApprove = () => {
        if (expirationDate && moment(expirationDate).isAfter()) {
            handleSubmitRecordReview({
                id: data?.id,
                dogId: data?.dogID,
                approved: true,
                expireDate: expirationDate,
            });
            handleClose();
        } else {
            // show error on field
            setFieldError('The expiration date must be a future date');
        }
    };

    const handleReject = () => {
        handleSubmitRecordReview({
            id: data?.id,
            dogId: data?.dogID,
            approved: false,
        });
        handleClose();
    };

    return (
        <Modal isOpen={open} toggle={handleClose}>
            <ModalHeader toggle={handleClose}>{data?.originalFilename}</ModalHeader>
            <ModalBody className='d-flex flex-column'>
                <a className='btn btn-secondary' href={data?.fileUrl} download={data?.originalFilename}>Download File</a>
                <hr />
                <Label>Expiration Date</Label>
                <Input
                    type='date'
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    readOnly={!allowReview}
                    onBlur={setFieldEntered}
                    invalid={(fieldEntered && !expirationDate) || fieldError}
                />
                {fieldError && <FormText color='danger'>{fieldError}</FormText>}
                {!allowReview && <FormText>This date is set during the review of the record.</FormText>}
                {allowReview && (
                    <>
                        <Button color='success' onClick={handleApprove} className='mt-2'>Approve Record</Button>
                        <Button color='danger' onClick={handleReject} className='mt-2'>Reject Record</Button>
                    </>
                )}
            </ModalBody>
        </Modal>
    );
};

export default RecordOptionsModal;
