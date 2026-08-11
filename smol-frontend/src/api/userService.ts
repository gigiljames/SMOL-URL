import { ROUTES } from "../constants/routes";
import { axiosInstance, type ResponseType } from "./axios";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface LogInPayload {
  email: string;
  password: string;
}

export interface AuthDataResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const signupUser = async (
  payload: SignUpPayload
): Promise<ResponseType<AuthDataResponse>> => {
  const response = await axiosInstance.post<ResponseType<AuthDataResponse>>(
    ROUTES.USER.SIGNUP,
    payload
  );
  return response.data;
};

export const loginUser = async (
  payload: LogInPayload
): Promise<ResponseType<AuthDataResponse>> => {
  const response = await axiosInstance.post<ResponseType<AuthDataResponse>>(
    ROUTES.USER.LOGIN,
    payload
  );
  return response.data;
};

export const logoutUser = async (): Promise<ResponseType> => {
  const response = await axiosInstance.post<ResponseType>(ROUTES.USER.LOGOUT);
  return response.data;
};

export const refreshUserToken = async (): Promise<
  ResponseType<AuthDataResponse>
> => {
  const response = await axiosInstance.post<ResponseType<AuthDataResponse>>(
    ROUTES.USER.REFRESH
  );
  return response.data;
};
