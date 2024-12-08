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

export interface MomoPurchaseStatus {
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
    purchaseBill: async (orderId: string, price: number): Promise<ApiResponse<MomoPurchaseResponse>> => {
        try {
            const response = await axios.post('http://localhost:8080/customer/momo/payment', {
                order_id: orderId,
                totalCost: price
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    // Kiểm tra trạng thái thanh toán
    checkTransactionStatus: async (orderId: string): Promise<ApiResponse<MomoPurchaseStatus>> => {
        try {
            const response = await axios.post('http://localhost:8080/customer/momo/transaction-status', {
                orderId: orderId
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    updateTransactionStatus: async (purchase_id: string, purchase_status: string): Promise<ApiResponse<PurchaseBills>> => {
        try {
            const response = await axiosClient.patch('/customer/purchase/update-status', {
                purchaseId: purchase_id,
                purchaseStatus: purchase_status
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    deletePurchaseBill: async (id: string): Promise<ApiResponse<PurchaseBills>> => {
        try {
            const response = await axiosClient.delete('/customer/purchase/delete-purchase', {
                params: {
                    purchaseId: id
                }
            });
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    }
};
