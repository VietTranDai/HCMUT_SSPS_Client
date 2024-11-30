import axiosClient from '../../axios/axiosConfig';
import axios from 'axios';

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

export interface MomoPurchaseBill {
    partnerCode: 'MOMO';
    orderId: string;
    requestId: string;
    extraData: string;
    amount: number;
    transId: number;
    payType: string;
    resultCode: number;
    refundTrans: [];
    message: string;
    responseTime: number;
    lastUpdated: number;
    signature: null;
}

export interface MomoPurchaseResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
    deeplink: string;
    qrCodeUrl: string;
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
    createNewBill: async (customerId: string, price: number, orderId: string, purchaseStatus: string, numberOfPage: number): Promise<ApiResponse<PurchaseBills>> => {
        try {
            const response = await axiosClient.post('/customer/purchase/create-new-log', {
                customerId,
                orderId,
                numberOfPage,
                price,
                purchaseStatus
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    // chọn phương thức thanh toán
    purchaseBill: async (no_of_page: number): Promise<ApiResponse<MomoPurchaseResponse>> => {
        try {
            const response = await axios.post('http://localhost:5000/payment', {
                totalCost: no_of_page
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    }
    // Kiểm tra trạng thái thanh toán
};
