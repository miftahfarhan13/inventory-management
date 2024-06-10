import axiosClient from "../apiClient";

export function getAssets(
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
    `/assets?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function getAsset(id: string, token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`/assets/${id}`, config);
}

export function fetchCreateAsset(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/assets/create`, data, config);
}

export function fetchUpdateAsset(token: string, data: any, id: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/assets/update/${id}`, data, config);
}

export function fetchDeleteAsset(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/assets/delete/${id}`, config);
}
