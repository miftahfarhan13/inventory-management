import axiosClient from "../apiClient";

export function getStudyProgram(
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
    `/study-programs?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
    config
  );
}

export function fetchCreateStudyProgram(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/study-programs/create`, data, config);
}

export function fetchUpdateStudyProgram(token: string, data: any, id: number) {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return axiosClient.post(`/study-programs/update/${id}`, data, config);
  }

export function fetchDeleteStudyProgram(token: string, id: number) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.delete(`/study-programs/delete/${id}`, config);
}
