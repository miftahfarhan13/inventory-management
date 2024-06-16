import axiosClient from "../apiClient";

export function getTotalAssetByStudyProgram(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`/dashboard/total-asset-by-study-program`, config);
}

export function getAllAssetLogSuccess(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`/dashboard/asset-log-success`, config);
}

export function getTotalPriceImprovement(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`/dashboard/total-price-improvement`, config);
}

export function getPercentageStatus(token: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`/dashboard/percentage-status`, config);
}
