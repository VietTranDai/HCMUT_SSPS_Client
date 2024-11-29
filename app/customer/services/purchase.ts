import axiosClient from '../../axios/axiosConfig';

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export interface PurchaseBills {
    id: string;
    customerId: string;
    orderId: string;
    transactionTime: string;
    numberOfPage: number;
    price: number;
    purchaseStatus: string;
}

export const PurchaseApi = {
    getAllBills: async (id: string): Promise<ApiResponse<PurchaseBills[]>> => {
        try {
            const response = await axiosClient.get(`/customer/purchase/get-all-purchases?customerId=${id}`);
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    createNewBill: async (customerId: string, totalPrice: number, orderId: string, purchaseStatus: string, numberOfPage: number): Promise<ApiResponse<PurchaseBills>> => {
        try {
            const response = await axiosClient.post('/customer/purchase/create-new-log', {
                customerId,
                numberOfPage,
                totalPrice,
                orderId,
                purchaseStatus
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    }
};
