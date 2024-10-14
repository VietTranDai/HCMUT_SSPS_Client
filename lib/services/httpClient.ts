import axios from 'axios'; // Import thư viện axios để gọi API
import { getCookie, removeCookie } from '../helpers/cookieStorage'; // Import các hàm xử lý cookie
import { AUTH_KEY, type LoginData } from './auth.service'; // Import key dùng để lưu trữ thông tin đăng nhập và kiểu dữ liệu cho LoginData
import { toast } from 'react-toastify'; // Import toast để hiển thị thông báo lỗi

// Tạo một axios instance với cấu hình mặc định
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Đặt baseURL dựa trên biến môi trường
    method: 'get', // Phương thức mặc định là GET
    headers: {
        'Content-Type': 'application/json', // Đặt tiêu đề yêu cầu mặc định là JSON
        Accept: 'application/json' // Yêu cầu phản hồi dưới định dạng JSON
    }
});

// timeout for each response is 20 seconds
axiosClient.defaults.timeout = 20000;

// Thêm một interceptor vào trước mỗi yêu cầu để thêm token xác thực (nếu có)
axiosClient.interceptors.request.use((config) => {
    const data = getCookie<LoginData>(AUTH_KEY); // Lấy thông tin đăng nhập từ cookie
    config.headers.Authorization = data ? `Bearer ${data.token}` : ''; // Nếu có token, thêm nó vào tiêu đề Authorization
    return config; // Trả về cấu hình yêu cầu với token đã thêm
});

// Thêm một interceptor cho phản hồi để xử lý lỗi
axiosClient.interceptors.response.use(
    (response) => response, // Trả về phản hồi gốc nếu không có lỗi
    (error) => {
        const { status } = error.response; // Lấy mã trạng thái HTTP từ phản hồi lỗi
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra'; // Lấy thông báo lỗi từ phản hồi hoặc đặt mặc định

        // Kiểm tra trang hiện tại
        if (window.location.pathname === '/login') {
            // toast.error("Đăng nhập thất bại, vui lòng thử lại."); // Hiển thị lỗi đăng nhập thất bại
            return Promise.reject('Đăng nhập thất bại');
        } else {
            if (status === 401) {
                // toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại."); // Hiển thị thông báo hết phiên
                removeCookie(AUTH_KEY); // Xóa thông tin đăng nhập
                window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
                return Promise.reject('Phiên đăng nhập hết hạn');
            } else if (status === 403) {
                // toast.error("Bạn không có quyền truy cập."); // Hiển thị thông báo không có quyền truy cập
                window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
                return Promise.reject('Bạn không có quyền truy cập');
            } else {
                toast.error(errorMessage); // Hiển thị lỗi cho các mã trạng thái khác
            }
        }

        return Promise.reject(error); // Nếu lỗi không thuộc mã 401 hoặc 403, trả về lỗi gốc
    }
);

export default axiosClient;
