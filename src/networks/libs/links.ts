import axiosClient from "../apiClient";

export function getLinks(
    token: string,
) {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    return axiosClient.get(`/links`, config);
}

export function fetchUpdateLinks(
    token: string,
    data: any,
    id: string
) {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    return axiosClient.post(`/links/update/${id}`, data, config);
}