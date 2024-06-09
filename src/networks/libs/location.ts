import axiosClient from "../apiClient";

export function getLocation(
  isPaginate: string,
  token: string,
  page?: string,
  show?: string,
  search?: string
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/locations?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function fetchCreateLocation(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/locations/create`, data, config);
}

export function fetchUpdateLocation(token: string, data: any, id: number) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axiosClient.post(`/locations/update/${id}`, data, config);
  }

export function fetchDeleteLocation(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/locations/delete/${id}`, config);
}
