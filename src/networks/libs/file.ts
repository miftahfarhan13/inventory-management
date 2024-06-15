import axiosClient from "../apiClient";

export function fetchImageUpload(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  return axiosClient.post(`/upload-image`, data, config);
}

export function fetchImageFile(token: string, data: any) {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  return axiosClient.post(`/upload-file`, data, config);
}
