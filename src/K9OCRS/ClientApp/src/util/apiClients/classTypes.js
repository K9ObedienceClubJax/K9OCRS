import axios from 'axios';

const base = '/api/classtypes';

// Create
export const createClassType = async (classTypeAddRequestFormData) =>
    await axios.post(base, classTypeAddRequestFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// Read
export const getAllClassTypes = async () =>
    await axios.get(base, { params: { includeSections: true } });

export const getClassTypeByID = async (classTypeId) =>
    await axios.get(`${base}/${classTypeId}`);

export const getPlaceholderImageUrl = async () =>
    await axios.get(`${base}/placeholderImageUrl`);

// Update
export const updateClassType = async (classTypeUpdateRequestFormData) =>
    await axios.put(base, classTypeUpdateRequestFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

// Delete
export const deleteClassType = async (classTypeId) =>
    await axios.delete(`${base}/${classTypeId}`);
