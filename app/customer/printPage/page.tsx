'use client';
import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import UploadedFilesList from './UploadedFilesList';
import Cookies from 'js-cookie';
import { AUTH_KEY } from '@/lib/services/auth.service';
import './styles.css';
import axiosClient from '@/lib/services/httpClient';

export interface FileItem {
    id: string;
    fileName: string;
    fileType: string;
    totalCostPage: number;
    printSideType: string;
    pageSize: string;
    pageToPrint: object;
    numOfCop: number;
    documentStatus: string;
    createdAt: string;
}
const App: React.FC = () => {
    const [filesUploaded, setFilesUploaded] = useState<FileItem[]>([]);

    const getCustomerId = () => {
        const authKey = Cookies.get(AUTH_KEY);
        if (authKey) {
            const parsedAuth = JSON.parse(authKey);
            return parsedAuth?.data?.user?.id || '';
        }
        return '';
    };

    const getAllDocuments = async (id: string) => {
        try {
            const response = await axiosClient(`/customer/document/by-customer`, {
                params: {
                    customerId: id
                }
            });
            if (response) {
                console.log(response.data);
                const datasWithKeys = response.data.data;
                setFilesUploaded(
                    datasWithKeys.map((item: FileItem) => ({
                        ...item,
                        key: item.id
                    }))
                );
            }
        } catch {
            console.log('Cannnot fetch data');
        }
    };

    const handleFileUpload = (file: FileItem) => {
        const datasWithKeys = [...filesUploaded, file];
        // setFilesUploaded(() => [file, ...filesUploaded]);
        setFilesUploaded(
            datasWithKeys.map((data) => ({
                key: data.id,
                ...data
            }))
        );
    };

    // useEffect(() => {
    //     const id = getCustomerId();
    //     getAllDocuments(id);
    // }, []);

    return (
        <div className="main-content">
            {/* <div className="main-content">
                <h1 className="Title">IN TÀI LIỆU</h1>
                <UploadSection />
            </div> */}
            <h1 className="Title">IN TÀI LIỆU</h1>
            <UploadSection onFileUpload={handleFileUpload} />
            <UploadedFilesList filesUploaded={filesUploaded} setFilesUploaded={setFilesUploaded} />
        </div>
    );
};

export default App;
