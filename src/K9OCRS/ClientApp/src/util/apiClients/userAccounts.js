import axios from 'axios';

const base = '/api/account';

// Create
export const createAccount = async (accountEntity) =>
  axios.post(base, accountEntity);

//Read
export const login = async (email, password) =>
  axios.post(`${base}/login`, { email, password });

export const loginStatus = async () => axios.get(`${base}/loginstatus`);

//Update

//Delete
export const logout = async () => axios.get(`${base}/logout`);

export default createAccount;
