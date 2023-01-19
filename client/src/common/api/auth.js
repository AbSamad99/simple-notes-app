import axios from "axios";

export const signup = async ({ body }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, body);
};

export const signin = async ({ body }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, body, {
    withCredentials: true,
    credentials: "include",
  });
};

export const signout = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/auth/signout`);
};

export const verifyEmail = async ({ id }) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/auth/verifyEmail/${id}`);
};

export const forgotPassword = async ({ body }) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/forgotPassword`,
    body
  );
};

export const verifyResetPassword = async ({ id }) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/auth/verifyResetPassword/${id}`
  );
};

export const resetPassword = async ({ body, id }) => {
  return axios.put(
    `${process.env.REACT_APP_API_URL}/auth/resetPassword/${id}`,
    body
  );
};

export const refreshAccessToken = async () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/auth/refresh/`, {
    withCredentials: true,
  });
};

export const getCurrentUser = async ({ accessToken }) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/auth/currentUser`, {
    headers: {
      Authorization: accessToken,
    },
  });
};
