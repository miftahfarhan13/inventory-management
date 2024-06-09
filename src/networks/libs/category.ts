import axiosClient from "../apiClient";

export function getCategories(
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
    `/categories?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function fetchCreateCategory(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/categories/create`, data, config);
}

export function fetchUpdateCategory(token: string, data: any, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/categories/update/${id}`, data, config);
}

export function fetchDeleteCategory(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/categories/delete/${id}`, config);
}
