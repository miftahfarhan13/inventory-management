import axiosClient from "../apiClient";

export function getAssetImprovements(
  isPaginate: string,
  token: string,
  page: string,
  show: string,
  search: string,
  body: any
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const queryString = new URLSearchParams(body).toString();

  return axiosClient.get(
    `/asset-improvements?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}&${queryString}`,
    config
  );
}

export function getAssetImprovementsByAssetId(
  isPaginate: string,
  token: string,
  page: string,
  show: string,
  search: string,
  id: string,
  body: any
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const queryString = new URLSearchParams(body).toString();

  return axiosClient.get(
    `/asset-improvements/asset/${id}?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}&${queryString}`,
    config
  );
}

export function fetchCreateAssetImprovement(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/asset-improvements/create`, data, config);
}

export function fetchCreateBulkAssetImprovement(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/asset-improvements/create-bulk`, data, config);
}

export function fetchUpdateAssetImprovementApproval(
  token: string,
  data: any,
  id: string
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axiosClient.post(`/asset-improvements/update-status/${id}`, data, config);
}
