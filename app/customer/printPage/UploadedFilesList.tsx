'use client';

import React, { useEffect, useState } from 'react';
import PdfIcon from '@/app/assets/pdf.png';
import jpgIcon from '@/app/assets/media (1).png';
import WordIcon from '@/app/assets/doc.png';
import Cookies from 'js-cookie';
import { AUTH_KEY } from '@/lib/services/auth.service';
import { Table, Card, Button, Space, Tooltip, Tag } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { FileItem } from './page';
import axiosClient from '@/lib/services/httpClient';
// interface FileItem {
//     id: string;
//     fileName: string;
//     fileType: string;
//     totalCostPage: number;
//     printSideType: string;
//     pageSize: string;
//     pageToPrint: object;
//     numOfCop: number;
//     documentStatus: string;
//     createdAt: string;
// }

interface UploadedFilesListProps {
    filesUploaded: FileItem[];
    setFilesUploaded: (files: FileItem[]) => void;
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ filesUploaded, setFilesUploaded }) => {
    console.log(filesUploaded);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [customerId, setCustomerId] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<FileItem[]>([]);
    // const [totalCost, setTotalCost] = useState<number>(0);
    const [confirm, setConfirm] = useState<boolean>(false);

    const getIconForFile = (file: { fileName: string }) => {
        if (!file.fileName) return undefined;
        const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
        if (fileExtension === 'pdf') return PdfIcon;
        if (fileExtension === 'docx' || fileExtension === 'doc') return WordIcon;
        if (fileExtension === 'jpg' || fileExtension === 'img') return jpgIcon;
        return undefined;
    };

    const getCustomerId = () => {
        const authKey = Cookies.get(AUTH_KEY);
        if (authKey) {
            const parsedAuth = JSON.parse(authKey);
            return parsedAuth?.data?.user?.id || '';
        }
        return '';
    };

    useEffect(() => {
        const id = getCustomerId();
        setCustomerId(id);
        // if (id) {
        //     getAllDocuments(id);
        // }
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
        setError(null);

        const customerId = getCustomerId();
        if (!customerId) {
            setError('Customer ID không hợp lệ.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/customer/document/by-customer?customerId=${customerId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch files: ${response.statusText}`);
            }
            const data = await response.json();
            const sortedFiles =
                data.data?.sort((a: FileItem, b: FileItem) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }) || [];

            setFiles(
                sortedFiles.map((item: FileItem) => ({
                    ...item,
                    key: item.id
                }))
            );
            setFilesUploaded(
                sortedFiles.map((item: FileItem) => ({
                    ...item,
                    key: item.id
                }))
            );
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const createPrintServiceLog = async () => {};

    useEffect(() => {
        fetchFiles();
    }, []);

    const columns: TableColumnsType<FileItem> = [
        {
            title: 'Tên file',
            dataIndex: 'fileName',
            width: 150,
            key: 'fileName',
            render: (value) => (
                <Space style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getIconForFile({ fileName: value })?.src} style={{ width: '50px', height: '50px' }}></img>
                    <div>{value}</div>
                </Space>
            )
        },
        {
            title: 'Loại file',
            dataIndex: 'fileType',
            width: 150,
            key: 'fileType',
            render: (_, record) => (
                <>
                    {/* {record.fileType === 'pdf' ? (
                        <Tag color="volcano" key={record.id}>
                            {record.fileType}
                        </Tag>
                    ) : (
                        <Tag color="green" key={record.id}>
                            {record.documentStatus}
                        </Tag>
                    )} */}
                    {record.fileType === 'doc' || (record.fileType === 'docx' && <Tag color="blue">{record.fileType}</Tag>)}
                    {record.fileType === 'pdf' && <Tag color="red">{record.fileType}</Tag>}
                    {record.fileType === 'jpg' && <Tag color="green">{record.fileType}</Tag>}
                </>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'documentStatus',
            width: 150,
            key: 'documentStatus',
            render: (_, record) => (
                <>
                    {record.documentStatus === 'PENDING' ? (
                        <Tag color="volcano" key={record.id}>
                            {record.documentStatus}
                        </Tag>
                    ) : (
                        <Tag color="green" key={record.id}>
                            {record.documentStatus}
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: 'Thao tác',
            width: 150,
            key: 'action',
            render: (value) => (
                <Space>
                    <Tooltip title="Chi tiết tập tin in">
                        <Button color="primary" variant="outlined" icon={<EyeOutlined />}></Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger icon={<DeleteOutlined />}></Button>
                    </Tooltip>
                </Space>
            )
        }
    ];

    // handle select rows
    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: FileItem[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
        setConfirm(!confirm);
    };

    const rowSelection: TableRowSelection<FileItem> = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: selectedRowKeys.length > 0 && !selectedRowKeys.includes(record.id)
        })
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '200px', marginBottom: '100px' }}>
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', marginTop: '30px' }} title="Tệp đính kèm">
                    <Table<FileItem>
                        dataSource={filesUploaded.length === 0 ? files : filesUploaded}
                        key={'id'}
                        columns={columns}
                        rowSelection={rowSelection}
                        pagination={{
                            pageSize: 5
                        }}
                    ></Table>
                </Card>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '50px' }}>
                <Button style={{ width: '150px', height: '50px', fontSize: '18px', border: '1px solid black' }}>In tài liệu</Button>
            </div>
        </div>
    );
};

export default UploadedFilesList;
