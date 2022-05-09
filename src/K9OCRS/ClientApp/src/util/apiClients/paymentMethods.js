import axios from 'axios';

const base = '/api/paymentMethods';

// Create
export const createPaymentMethod = (paymentMethodAddRequest) =>
    axios.post(base, paymentMethodAddRequest);

// Read
export const getPaymentMethods = (includeArchived = false) =>
    axios.get(base, { params: { includeArchived } });

export const getPaymentMethodById = (paymentMethodId) => axios.get(`${base}/${paymentMethodId}`);

// Update
export const updatePaymentMethod = (paymentMethodUpdateRequest) =>
    axios.put(base, paymentMethodUpdateRequest);

// Delete
export const deletePaymentMethod = (paymentMethodId) => axios.delete(`${base}/${paymentMethodId}`);
