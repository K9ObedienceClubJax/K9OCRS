import axios from 'axios';
import { filesToFormData } from '../formData';

const base = '/api/classtypes';

// Create
export const createClassType = async classTypeEntity => await axios.post(base, classTypeEntity);

export const addClassTypePhotos = async (classTypeId, files) => await axios.put(`${base}/${classTypeId}/photos`, filesToFormData(files), {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Read
export const getAllClassTypes = async () => await axios.get(base, { params: { includeSections: true } });

export const getClassTypeByID = async classTypeId => await axios.get(`${base}/${classTypeId}`);

export const getPhotosByClassTypeID = async classTypeId => await axios.get(`${base}/${classTypeId}/photos`);

// Update
export const updateClassType = async classTypeEntity => await axios.put(base, classTypeEntity);

export const updateClassTypeImage = async (classTypeId, files) => await axios.put(`${base}/${classTypeId}/image`, filesToFormData(files), {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Delete
export const deleteClassType = async classTypeId => await axios.delete(`${base}/${classTypeId}`);

export const deleteClassTypeImage = async (classTypeId, filename) => await axios.delete(`${base}/${classTypeId}/image/${filename}`);

export const deleteClassTypePhotos = async (classTypeId, listOfFilenames) => await axios.delete(`${base}/${classTypeId}/photos`, {
  data: listOfFilenames,
  headers: {
    'Content-Type': 'application/json'
  }
});
