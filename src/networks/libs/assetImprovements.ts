import axiosClient from "../apiClient";

export function getAssetImprovementsByAssetId(
  isPaginate: string,
  token: string,
  page: string,
  show: string,
  search: string,
  id: string
) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/asset-improvements/asset/${id}?is_paginate=${isPaginate}&page=${page}&per_page=${show}&search=${search}`,
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
