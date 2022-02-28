import { AuthAccount } from "features/auth";
import { axios } from "lib/axios";

export type RegisterCredentialsDTO = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export const registerWithEmailAndPassword = (
  data: RegisterCredentialsDTO
): Promise<AuthAccount> => {
  return axios.post("/auth/register", data);
};
