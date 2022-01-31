import axios from 'axios';

const base = '/api/account';

// Create
export const createAccount = async (accountEntity) =>
  axios.post(base, accountEntity);

//Read
export const login = async (email, password) =>
  axios.post(`${base}/login`, { email, password });

//Update

//Delete

export default createAccount;
