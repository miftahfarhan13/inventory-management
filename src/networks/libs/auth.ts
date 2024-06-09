import axiosClient from "../apiClient";

export function getUsers(
  isPaginate: string,
  token: string,
  page: string,
  show: string,
  search: string
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/users?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function fetchLogin(data: any) {
  return axiosClient.post("/login", data);
}

export function fetchRegister(data: any, token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post("/register", data, config);
}

export function fetchUpdateUser(data: any, token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/update-user/${id}`, data, config);
}

export function fetchUpdateProfile(data: any, token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post("/update-user", data, config);
}

export function fetchUpdateProfilePassword(data: any, token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post("/user/update/password", data, config);
}

export function fetchLogout(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post("/logout", {}, config);
}

export function fetchLoggedUser(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get("/me", config);
}

export function fetchForgotPassword(data: any) {
  return axiosClient.post("/forget_password", data);
}

export function fetchChangePassword(data: any) {
  return axiosClient.post("/change_password", data);
}

export function fetchDeleteUser(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/user/delete/${id}`, config);
}
