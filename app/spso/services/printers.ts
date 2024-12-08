import axiosClient from '../../axios/axiosConfig';

interface ApiResponse<T> {
    data: T;
    status?: number;
    message?: string;
}

export enum printerStatus {
    MAINTENANCE = 'MAINTENANCE',
    ENABLE = 'ENABLE'
}

export interface LocationInfo {
    id: string;
    campusName: string;
    buildingName: string;
    roomName: string;
    campusAdress: string;
    hotline: string;
    description: string;
}
export interface PrinterType {
    id: string;
    createdAt: string;
    updatedAt: string;
    brandName: string;
    model: string;
    shortDescription: string;
    printerStatus: printerStatus;
    isInProgress: boolean;
    locationId: string;
    location: LocationInfo;
}

export const PrinterApi = {
    getAllPrinters: async (): Promise<ApiResponse<PrinterType[]>> => {
        try {
            const response = await axiosClient.get('/spso/printer/get-all');
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    },
    getPrinterLocation: async (id: string): Promise<ApiResponse<LocationInfo>> => {
        try {
            const response = await axiosClient.get(`/spso/printer-location/get-by-id/${id}`);
            return {
                data: response.data
            };
        } catch (err) {
            throw err;
        }
    }
};
