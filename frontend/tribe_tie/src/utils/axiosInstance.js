import axios from "axios";
import { BASE_URL } from "../constant/api_url";

const accessToken = localStorage.getItem('access')

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers:{
        Accept:'application/json',
        Authorization:`Bearer ${accessToken}`
    }
})

export default axiosInstance