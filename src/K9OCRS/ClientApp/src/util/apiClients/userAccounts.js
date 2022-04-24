import axios from 'axios';

const base = '/api/account';

// Create
export const createAccount = async (accountEntity) => axios.post(base, accountEntity);

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

export const createUser = async (changeUserInfoRequest) =>
    await axios.put(`${base}/createuser`, changeUserInfoRequest);

//Read
export const login = async (email, password) => axios.post(`${base}/login`, { email, password });

export const loginStatus = async () => axios.get(`${base}/loginstatus`);

export const getUser = async (id) =>
    axios
        .post(`${base}/getuser`, id, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then((response) => response.data);

export const getInstructorOptions = async () => axios.get(`${base}/options`);

//Update
export const changePassword = async ({ token, password }) =>
    axios.post(`${base}/changepassword`, { token, password }, { password });

export const changeInfo = async (changeUserInfoRequest) =>
    await axios.put(`${base}/changeinfo`, changeUserInfoRequest);

export const changeInfoAdmin = async (changeUserInfoRequest) =>
    await axios.put(`${base}/changeinfoadmin`, changeUserInfoRequest);

export const queryUsers = async (role) =>
    axios
        .post(`${base}/queryusers`, role, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then((response) => response.data);

//Delete
export const logout = async () => axios.get(`${base}/logout`);

export default createAccount;
