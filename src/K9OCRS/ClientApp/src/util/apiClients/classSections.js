import axios from 'axios';

const base = '/api/classsections';

// Create
export const createClassSection = async (sectionAddRequest) =>
    await axios.post(base, sectionAddRequest);

// Read
export const getAllSections = async () => await axios.get(base);
export const getSectionByID = async (sectionId) => await axios.get(`${base}/${sectionId}`);

// Update
export const updateSection = async (sectionUpdateRequest) =>
    await axios.put(base, sectionUpdateRequest);

// Delete
export const deleteSection = async (sectionId) => await axios.delete(`${base}/${sectionId}`);
