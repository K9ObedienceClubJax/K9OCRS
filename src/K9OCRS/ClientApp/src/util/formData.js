/**
 * Takes the files array you get from an html file input and makes it
 * into FormData so it can be sent to the API
 * @param {FormFileCollection} files
 * @returns FormData
 */
export const filesToFormData = (files) => {
    var formData = new FormData();

    // This is how you would upload multiple files
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
    }

    return formData;
};

// Class Type Requests

export const classTypeAddRequestToFormData = ({
    title,
    description,
    requirements,
    duration,
    price,
    image,
    photos,
}) => {
    var formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('price', price);

    if (requirements) {
        formData.append('requirements', requirements);
    }

    if (image) {
        formData.append('image', image, image.name);
    }

    if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
            formData.append('photos', photos[i], photos[i].name);
        }
    }

    return formData;
};

export const classTypeUpdateRequestToFormData = ({
    id,
    title,
    description,
    requirements,
    duration,
    price,
    imageUpdate,
    photosToAdd,
    photosToRemove,
}) => {
    var formData = new FormData();

    formData.append('id', id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('price', price);

    if (requirements) {
        formData.append('requirements', requirements);
    }

    if (imageUpdate) {
        formData.append('imageUpdate', imageUpdate, imageUpdate.name);
    }

    if (photosToAdd && photosToAdd.length > 0) {
        for (let i = 0; i < photosToAdd.length; i++) {
            formData.append('photosToAdd', photosToAdd[i], photosToAdd[i].name);
        }
    }

    if (photosToRemove) {
        formData.append('photosToRemove', JSON.stringify(photosToRemove));
    }

    return formData;
};

// Dog Requests

export const dogAddRequestToFormData = ({
    name,
    breed,
    dateOfBirth,
    image,
    vaccinationRecord,
    ownersIdsToInsert,
}) => {
    var formData = new FormData();

    formData.append('name', name);
    formData.append('breed', breed);
    formData.append('dateOfBirth', dateOfBirth);

    if (image) {
        formData.append('image', image, image.name);
    }

    if (vaccinationRecord) {
        formData.append('vaccinationRecord', vaccinationRecord, vaccinationRecord.name);
    }

    if (ownersIdsToInsert && ownersIdsToInsert.length > 0) {
        for (let i = 0; i < ownersIdsToInsert.length; i++) {
            formData.append('ownersIdsToInsert', ownersIdsToInsert[i]);
        }
    }

    return formData;
};

export const dogUpdateRequestToFormData = ({
    id,
    name,
    breed,
    dateOfBirth,
    image,
    vaccinationRecord,
    ownersIdsToInsert,
    ownerIdsToDelete,
}) => {
    var formData = new FormData();

    formData.append('id', id);
    formData.append('name', name);
    formData.append('breed', breed);
    formData.append('dateOfBirth', dateOfBirth);

    if (image) {
        formData.append('image', image, image.name);
    }

    if (vaccinationRecord) {
        formData.append('vaccinationRecord', vaccinationRecord, vaccinationRecord.name);
    }

    if (ownersIdsToInsert && ownersIdsToInsert.length > 0) {
        for (let i = 0; i < ownersIdsToInsert.length; i++) {
            formData.append('ownersIdsToInsert', ownersIdsToInsert[i]);
        }
    }

    if (ownerIdsToDelete && ownerIdsToDelete.length > 0) {
        for (let i = 0; i < ownerIdsToDelete.length; i++) {
            formData.append('ownerIdsToDelete', ownerIdsToDelete[i]);
        }
    }

    return formData;
};
