import React, { useState, useEffect } from 'react';
import { getClassTypeOptions } from 'Util/apiClients/classTypes';
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
    const { classTypeId, toggle, isOpen, loading, submitting, handleDelete, sectionsCount } = props;
    const mustReassignSections = sectionsCount > 0;

    const [loadingOptions, setLoadingOptions] = useState(false);
    const [typeOptions, setTypeOptions] = useState(null);
    const [targetClassType, setTargetClassType] = useState(undefined);

    const disableDelete = loading || submitting || (mustReassignSections && !targetClassType);

    const deleteHandler = () =>
        mustReassignSections ? handleDelete(targetClassType) : handleDelete();

    const reassignPrompt = `This class type has ${sectionsCount} sections that must be reassigned before it can be deleted. Please select a new class type.`;

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
            <ModalFooter>
                <Button color="danger" disabled={disableDelete} onClick={deleteHandler}>
                    {mustReassignSections ? 'Reassign and Delete' : 'Delete'}
                    {submitting && <Spinner className="ms-3" size="sm" />}
                </Button>
                <Button color="secondary" onClick={toggle} outline>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteModal;
