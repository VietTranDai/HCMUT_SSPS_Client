'use client';

import React, { useEffect, useState } from 'react';
import PdfIcon from '@/app/assets/pdf.png';
import jpgIcon from '@/app/assets/media (1).png';
import WordIcon from '@/app/assets/doc.png';
import Cookies from 'js-cookie';
import { AUTH_KEY } from '@/lib/services/auth.service';
import { Table, Card, Button, Space, Tooltip, Tag, Modal, Select, Radio, Input } from 'antd';
import type { RadioChangeEvent, TableColumnsType, TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { FileItem } from './page';
import axiosClient from '@/lib/services/httpClient';
import { LocationInfo, PrinterApi } from '@/app/spso/services/printers';
import { toast } from 'react-toastify';
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

interface printerOption {
    value: string;
    id: string;
    label: string;
    key: string;
    location: LocationInfo;
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ filesUploaded, setFilesUploaded }) => {
    const initialPrinterLocation: LocationInfo = {
        id: '',
        campusName: '',
        buildingName: '',
        roomName: '',
        campusAdress: '',
        hotline: '',
        description: ''
    };
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [customerId, setCustomerId] = useState<string>('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<FileItem[]>([]);
    const [printerModal, setPrinterModal] = useState<boolean>(false);
    // const [totalCost, setTotalCost] = useState<number>(0);
    const [confirm, setConfirm] = useState<boolean>(false);
    // let optionsCs1: printerOption[] = [];
    // let optionsCs2: printerOption[] = [];
    const [optionsCs1, setOptionsCs1] = useState<printerOption[]>([]);
    const [optionsCs2, setOptionsCs2] = useState<printerOption[]>([]);
    const [printerLocation, setPrinterLocation] = useState<LocationInfo>(initialPrinterLocation);
    const [printerId, setPrinterId] = useState<string>('');

    const [campus, setCampus] = useState<number>(1);

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

    const createPrintServiceLog = async (customerId: string, printerId: string, documentIds: string[]) => {
        try {
            const response = await axiosClient.post('/customer/print-service/create', {
                customerId,
                printerId,
                documentIds
            });
            if (response) {
                console.log(response.data);
                toast.success('Tạo nhật ký in thành công');
            }
        } catch (err) {
            console.log(err);
            toast.error('Tạo nhật ký in thất bại');
        }
    };

    const handleSelectChange = (value: string, option: printerOption) => {
        if (campus === 1) {
            // console.log('selected lists ', optionsCs1);
            // setSelectedOptions(optionsCs1);
            console.log(value, option.location.buildingName);
            setPrinterLocation(option.location);
            setPrinterId(option.id as string);
        } else if (campus === 2) {
            // console.log('selected lists ', optionsCs2);
            // setSelectedOptions(optionsCs2);
            console.log(value, option.location.buildingName);
            setPrinterLocation(option.location);
            setPrinterId(option.id as string);
        }
    };

    const getPrinter = async () => {
        try {
            const response = await PrinterApi.getAllPrinters();

            if (response) {
                // console.log(response.data[0]?.location);
                response.data.map((printer) => {
                    if (printer.location.campusName === 'CS1' && printer.printerStatus === 'ENABLE') {
                        // setOptionsCs1((prevOptions) => [...prevOptions, { value: printer.model, label: printer.model, key: `${printer.id}-${printer.location.campusName}` }]);
                        setOptionsCs1((prevOptions) => {
                            if (!prevOptions.some((option) => option.key === printer.id)) {
                                return [
                                    ...prevOptions,
                                    {
                                        value: printer.model,
                                        label: printer.model,
                                        key: printer.id,
                                        location: printer.location,
                                        id: printer.id
                                    }
                                ];
                            }
                            return prevOptions; // Do not add duplicate
                        });
                    } else if (printer.location.campusName === 'CS2' && printer.printerStatus === 'ENABLE') {
                        // setOptionsCs2((prevOptions) => [...prevOptions, { value: printer.model, label: printer.model, key: `${printer.id}-${printer.location.campusName}` }]);
                        setOptionsCs2((prevOptions) => {
                            if (!prevOptions.some((option) => option.key === printer.id)) {
                                return [
                                    ...prevOptions,
                                    {
                                        value: printer.model,
                                        label: printer.model,
                                        key: printer.id,
                                        location: printer.location,
                                        id: printer.id
                                    }
                                ];
                            }
                            return prevOptions; // Do not add duplicate
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const hanldeRadioChange = (e: RadioChangeEvent) => {
        setCampus(e.target.value);
    };

    useEffect(() => {
        fetchFiles();
        getPrinter();
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
        onChange: onSelectChange
        // getCheckboxProps: (record) => ({
        //     disabled: selectedRowKeys.length > 0 && !selectedRowKeys.includes(record.id)
        // })
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
                <Button
                    style={{ width: '150px', height: '50px', fontSize: '18px', border: '1px solid black' }}
                    disabled={selectedRowKeys.length === 0 ? true : false}
                    onClick={() => {
                        setPrinterModal(true);
                        console.log(optionsCs1);
                        console.log(optionsCs2);
                    }}
                >
                    Tạo nhật ký in
                </Button>
            </div>
            <Modal
                title="Thông tin máy in"
                open={printerModal}
                onCancel={() => {
                    setPrinterModal(false), setPrinterLocation(initialPrinterLocation), setCampus(0), setPrinterLocation(initialPrinterLocation);
                }}
                footer={() => (
                    <>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                setPrinterModal(false), setPrinterLocation(initialPrinterLocation), setCampus(0);
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                                createPrintServiceLog(
                                    customerId,
                                    printerId,
                                    selectedRowKeys.map((key) => String(key))
                                )
                            }
                            disabled={!customerId || !printerId || selectedRowKeys.length === 0 ? true : false}
                        >
                            Xác nhận tạo
                        </Button>
                    </>
                )}
            >
                <div className="same-field">
                    <label>Chọn cơ sở</label>
                    <Radio.Group onChange={hanldeRadioChange} value={campus}>
                        <Radio value={1}>Cơ sở 1</Radio>
                        <Radio value={2}>Cơ sở 2</Radio>
                    </Radio.Group>
                </div>
                <div className="same-field">
                    <label>Chọn máy in</label>
                    {campus === 1 && <Select style={{ width: 200 }} onChange={(value, option) => handleSelectChange(value, option as printerOption)} options={optionsCs1} placeholder="Chọn máy in ở CS1"></Select>}
                    {campus === 2 && <Select style={{ width: 200 }} onChange={(value, option) => handleSelectChange(value, option as printerOption)} options={optionsCs2} placeholder="Chọn máy in ở CS2"></Select>}
                </div>
                {printerLocation.id !== '' && (
                    <div>
                        <div className="same-field">
                            <label>Địa chỉ</label>
                            <Input style={{ width: 280 }} value={printerLocation.campusAdress} disabled></Input>
                        </div>
                        <div className="same-field">
                            <label>Tòa - Phòng</label>
                            <Input style={{ width: 200 }} value={printerLocation.roomName} disabled></Input>
                        </div>
                        <div className="same-field">
                            <label>Hotline</label>
                            <Input style={{ width: 200 }} value={printerLocation.hotline}></Input>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UploadedFilesList;
