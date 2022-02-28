import { AuthAccount } from "features/auth";
import { axios } from "lib/axios";

export const getCurrentUser = (): Promise<AuthAccount> => {
  return axios.get("/accounts/me");
};
