import axios from "axios";

const base = "/api/account";

// Create
export const createAccount = async (accountEntity) =>
  axios.post(base, accountEntity);

//Read

//Update

//Delete

export default createAccount;
