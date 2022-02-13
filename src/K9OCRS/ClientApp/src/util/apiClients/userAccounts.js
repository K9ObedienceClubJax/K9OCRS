import axios from 'axios';

const base = '/api/account';

// Create
export const createAccount = async (accountEntity) =>
  axios.post(base, accountEntity);

export const forgotPassword = async (email) =>
  axios({
    url: `${base}/forgotpassword`,
    data: email,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

//Read
export const login = async (email, password) =>
  axios.post(`${base}/login`, { email, password });

export const loginStatus = async () => axios.get(`${base}/loginstatus`);

//Update
export const changePassword = async ({ token, password }) =>
  axios.post(`${base}/changepassword`, { token, password }, { password });

export const changeInfo = async (id, firstname, lastname, email) =>
  axios.post(`${base}/changeinfo`, { id, firstname, lastname, email });

//Delete
export const logout = async () => axios.get(`${base}/logout`);

export default createAccount;
