import { axios } from "lib/axios";

export type LoginCredentialsDTO = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export const loginWithEmailAndPassword = ({
  username,
  password,
}: LoginCredentialsDTO): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);

  return axios.post("/auth/jwt/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
