import axiosClient from "../apiClient";

export function getYearQuarter(
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
    `/quarter-years?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function fetchCreateYearQuarter(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/quarter-years/create`, data, config);
}

export function fetchUpdateYearQuarter(token: string, data: any, id: number) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axiosClient.post(`/quarter-years/update/${id}`, data, config);
  }

export function fetchDeleteYearQuarter(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/quarter-years/delete/${id}`, config);
}
