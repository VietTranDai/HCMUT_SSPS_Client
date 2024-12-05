import axios from 'axios';
import { AUTH_KEY } from '@/lib/services/auth.service'; // Import AUTH_KEY
import Cookies from 'js-cookie';

// Tạo instance axios với cấu hình mặc định
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Địa chỉ API của bạn
    timeout: 10000, // Thời gian chờ tối đa
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// Cấu hình interceptor (nếu cần)
// interceptor cho các yêu cầu
axiosClient.interceptors.request.use(
    (config) => {
        // Thêm token hoặc xử lý trước khi gửi yêu cầu
        const authKey = Cookies.get(AUTH_KEY);
        if (authKey) {
            const token = JSON.parse(authKey as string).data.token;
            config.headers.Authorization = `Bearer ${token}`;
        }
        // const token = localStorage.getItem('token'); // Lấy token từ localStorage (nếu có)
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// interceptor cho các phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        return response.data; // Chỉ trả về dữ liệu
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
