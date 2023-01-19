import axios from "axios";

export const getAllNotes = ({ accessToken }) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/note/`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const getNoteById = ({ accessToken, id }) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/note/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const createNote = ({ body, accessToken }) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/note/create`, body, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const updateNote = ({ body, accessToken, id }) => {
  return axios.put(`${process.env.REACT_APP_API_URL}/note/update/${id}`, body, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const deleteNote = ({ accessToken, id }) => {
  console.log(accessToken);
  return axios.delete(`${process.env.REACT_APP_API_URL}/note/delete/${id}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};
