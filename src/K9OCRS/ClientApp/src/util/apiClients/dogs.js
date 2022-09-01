import axios from 'axios';

const base = 'api/dogs';

// create
export const createDog = async (dogAddRequest) =>
    axios.post(base, dogAddRequest, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// read all
export const getAllDogs = async () => axios.get(base);

// read owned
export const getOwnedDogs = async () => axios.get(`${base}/owned`);

// read by id
export const getById = async (dogId) => axios.get(`${base}/${dogId}`);

// update
export const updateDog = async (dogUpdateRequest) =>
    axios.put(base, dogUpdateRequest, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const reviewRecord = async (review) => axios.put(`${base}/reviewRecord`, review);

// delete by id
export const deleteById = async (dogId) => axios.delete(`${base}/${dogId}`);

//post picture
export const postPicture = async (dogId, formData) =>
    axios.put(`${base}/${dogId}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const archiveDog = async (dogId) => await axios.post(`${base}/archive/${dogId}`);

export const unarchiveDog = async (dogId) => await axios.post(`${base}/unarchive/${dogId}`);

// delete image by id
export const deleteImageById = async (dogId, fileName) =>
    axios.delete(`${base}/${dogId}/image`, { params: { fileName } });

export const getPlaceholderImageUrl = async () => await axios.get(`${base}/placeholderImageUrl`);
