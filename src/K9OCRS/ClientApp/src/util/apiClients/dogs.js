import axios from "axios";

const base = 'api/dogs';

// create
export const createDog = async (dogEntity) =>
    axios.post(base,dogEntity);

// read all
export const getAllDogs = async () =>
    axios.get(base);

// read owned
export const getOwnedDogs = async () =>
    axios.get(`${base}/owned`);

// read by id
export const getById = async (dogId) =>
    axios.get(`${base}/${dogId}`);

// update
export const updateDog = async (dogEntity) =>
    axios.put(base,dogEntity);

// delete by id
export const deleteById = async (dogId) =>
    axios.delete(`${base}/${dogId}`);

//post picture
export const postPicture = async (dogId, formData) =>
    axios.put(`${base}/${dogId}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// delete image by id
export const deleteImageById = async (dogId, fileName) =>
    axios.delete(`${base}/${dogId}/image`, { params: { fileName } } );

export const getPlaceholderImageUrl = async () => await axios.get(`${base}/placeholderImageUrl`);