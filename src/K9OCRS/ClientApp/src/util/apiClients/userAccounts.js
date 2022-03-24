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

export const createUser = async (email, first, last, password, role) =>
    axios.post(`${base}/createuser`, {
        email,
        first,
        last,
        password,
        role,
    });

//Read
export const login = async (email, password) =>
    axios.post(`${base}/login`, { email, password });

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

//Update
export const changePassword = async ({ token, password }) =>
    axios.post(`${base}/changepassword`, { token, password }, { password });

export const changeInfo = async (id, firstname, lastname, email) =>
    axios.post(`${base}/changeinfo`, { id, firstname, lastname, email });

export const changeInfoAdmin = async (
    id,
    firstname,
    lastname,
    email,
    userRoleID,
    profilePictureFilename
) =>
    axios.post(`${base}/changeinfoadmin`, {
        id,
        firstname,
        lastname,
        email,
        userRoleID,
        profilePictureFilename,
    });

export const queryUsers = async (role) =>
    axios
        .post(`${base}/queryusers`, role, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        .then((response) => response.data);

export const updateProfilePicture = async (profilePictureUpdateRequest) =>
    await axios.post(
        `${base}/updateprofilepicture`,
        profilePictureUpdateRequest
    );

//Delete
export const logout = async () => axios.get(`${base}/logout`);

export default createAccount;
