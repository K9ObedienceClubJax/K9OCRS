import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
    Input,
    FormGroup,
    Label,
    Spinner,
} from 'reactstrap';

const DeleteModal = (props) => {
    const { dogId, toggle, isOpen, loading, submitting, handleDelete } = props;

    const [targetDog, setTargetDog] = useState(undefined);

    const disableDelete = loading || submitting || !targetDog;

    const deleteHandler = () => (mustReassignSections ? handleDelete(targetDog) : handleDelete());

    const deleteWarning =
        "This action can't be reverted. This class type and all the photos related to it will be deleted.";

    useEffect(() => {
        if (typeOptions === null) {
            async function getOptions() {
                try {
                    setLoadingOptions(true);
                    const res = await getClassTypeOptions(classTypeId);
                    setTypeOptions(res?.data);
                    setLoadingOptions(false);
                } catch (err) {}
            }
            getOptions();
        }
    }, [classTypeId, typeOptions, setTypeOptions]);

    const handleSelect = (e) => {
        if (e.target.value !== '') {
            setTargetClassType(parseInt(e.target.value));
        } else {
            setTargetClassType(undefined);
        }
    };

    return (
        <Modal backdrop="static" toggle={toggle} isOpen={isOpen}>
            <ModalHeader toggle={toggle}>Confirmation</ModalHeader>
            <ModalBody>
                <Alert color="danger">{deleteWarning}</Alert>
                {mustReassignSections && (
                    <>
                        <p>{reassignPrompt}</p>
                        <FormGroup>
                            <Label for="TargetClassType">Class Type</Label>
                            <Input
                                id="TargetClassType"
                                type="select"
                                onChange={handleSelect}
                                disabled={loadingOptions}
                            >
                                <option>{loadingOptions ? 'Loading...' : ''}</option>
                                {!loadingOptions &&
                                    typeOptions?.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.title}
                                        </option>
                                    ))}
                            </Input>
                        </FormGroup>
                    </>
                )}
            </ModalBody>
        </Modal>
    );
};
