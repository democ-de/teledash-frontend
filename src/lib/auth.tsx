import { initReactQueryAuth } from "react-query-auth";

import { Spinner } from "components/Elements";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
  AuthAccount,
} from "features/auth";
import storage from "utils/storage";
import { getCurrentUser } from "features/accounts";

async function loadUser() {
  if (storage.getToken()) {
    const data = await getCurrentUser();
    return data;
  }
  return null;
}

async function loginFn(data: LoginCredentialsDTO) {
  const { access_token } = await loginWithEmailAndPassword(data);
  storage.setToken(access_token);
  const user = await loadUser();
  return user;
}

async function registerFn(data: RegisterCredentialsDTO) {
  const user = await registerWithEmailAndPassword(data);
  const { access_token } = await loginWithEmailAndPassword({
    username: data.email,
    password: data.password,
  });
  storage.setToken(access_token);
  return user;
}

async function logoutFn() {
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" className="text-blue-600" />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
  AuthAccount | null,
  unknown,
  LoginCredentialsDTO,
  RegisterCredentialsDTO
>(authConfig);
