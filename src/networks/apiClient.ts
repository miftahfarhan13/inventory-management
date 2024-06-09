import axios from "axios";
const axiosClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default axiosClient;

