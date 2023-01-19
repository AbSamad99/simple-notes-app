import axios from "axios";

export const createUser = ({ body, accessToken }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/user/create/`, body, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const updateUser = ({ body, accessToken, id }) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/user/update/${id}`, body, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const updateUserPassword = ({ body, accessToken, id }) => {
  return axios.put(
    `${process.env.REACT_APP_API_URL}/user/updatePassword/${id}`,
    body,
    {
      headers: {
        Authorization: accessToken,
      },
    }
  );
};

export const deleteUser = ({ accessToken, id }) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/user/delete/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const getAllUsers = ({ accessToken }) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/user/`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const getUserById = ({ accessToken, id }) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};
