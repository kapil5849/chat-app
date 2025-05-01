import axios from 'axios';

export const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: "http://localhost:5001/api",
=======
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : '/api',
>>>>>>> master
    withCredentials: true,
})