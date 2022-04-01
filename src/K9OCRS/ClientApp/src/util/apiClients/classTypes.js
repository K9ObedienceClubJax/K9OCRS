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
export const getAllClassTypes = async (
    includeArchived = false,
    includeSections = true,
    includeDrafts = false
) => await axios.get(base, { params: { includeArchived, includeSections, includeDrafts } });

export const getClassTypeByID = async (classTypeId, includeDrafts = false) =>
    await axios.get(`${base}/${classTypeId}`, {
        params: { includeDrafts },
    });

export const getPlaceholderImageUrl = async () => await axios.get(`${base}/placeholderImageUrl`);

export const getClassTypeOptions = async () => await axios.get(`${base}/options`);

// Update
export const updateClassType = async (classTypeUpdateRequestFormData) =>
    await axios.put(base, classTypeUpdateRequestFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const archiveClassType = async (classTypeId) =>
    await axios.post(`${base}/archive/${classTypeId}`);

export const unarchiveClassType = async (classTypeId) =>
    await axios.post(`${base}/unarchive/${classTypeId}`);

// Delete
export const deleteClassType = async (classTypeId, reassignSectionsToId = undefined) =>
    await axios.delete(`${base}/${classTypeId}`, { params: { reassignSectionsToId } });
