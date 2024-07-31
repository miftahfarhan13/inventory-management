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

export function getTotalAssetComparison(token: string, year: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/dashboard-wadek/comparison-number-good-and-repair-assets?year=${year}`,
    config
  );
}

export function getRepairTimeAsset(token: string, year: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/dashboard-wadek/repair-time-asset?year=${year}`,
    config
  );
}

export function getRepairAssetFund(token: string, year: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/dashboard-wadek/total-asset-repair-fund?year=${year}`,
    config
  );
}

export function getPercentageRepairAsset(token: string, year: string) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(
    `/dashboard-wadek/percentage-repair-asset?year=${year}`,
    config
  );
}
