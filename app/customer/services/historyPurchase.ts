import axiosClient from '@/app/axios/axiosConfig';

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export const HistoryPurchaseApi = {
    getAllHistory: async () => {
        try {
            const response = await axiosClient.get('/cusomter/purchase/get-all-purchases');
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    }
};
