'use client';

import { Table, Card, Pagination, Space, Button, Tooltip, Modal, Input, Tag } from 'antd';
import type { InputRef, TableColumnType, TableColumnsType, TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface';
import { useState, useRef, useEffect } from 'react';
import { LocationInfo, PrinterApi, printerStatus, PrinterType } from '../services/printers';
import './index.css';

interface DataType {
    key: number;
    brand: string;
    model: string;
    description: string;
    printer_status: printerStatus;
    location: string;
}

type DataIndex = keyof PrinterType;
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const { TextArea } = Input;
export default function Home() {
    const initialPrinter: PrinterType = {
        id: '',
        createdAt: '',
        updatedAt: '',
        brandName: '',
        model: '',
        shortDescription: '',
        printerStatus: printerStatus.ENABLE,
        isInProgress: false,
        locationId: ''
    };

    const initialLocation: LocationInfo = {
        id: '',
        campusName: '',
        buildingName: '',
        roomName: '',
        campusAdress: '',
        hotline: '',
        description: ''
    };
    const [datas, setDatas] = useState<DataType[]>([]);
    const [i, setI] = useState<number>(8);

    const [confirm, setConfirm] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [locationModal, setLocationModal] = useState<boolean>(false);

    // Related to PrinterType
    const [printers, setPrinters] = useState<PrinterType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<PrinterType[]>([]);
    const [printer, setPrinter] = useState<PrinterType>(initialPrinter);
    const [location, setLocation] = useState<LocationInfo>(initialLocation);

    // Implementation for checkbox
    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: PrinterType[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
        setConfirm(!confirm);
    };

    const rowSelection: TableRowSelection<PrinterType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: selectedRowKeys.length > 0 && !selectedRowKeys.includes(record.id)
        })
    };

    const handlePageSizeChange = (current: number, value: number) => {
        setPageSize(value);
        setCurrentPage(1); // Reset to the first page when page size changes
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<PrinterType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                    ref={searchInput}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }}></SearchOutlined>,
        onFilter: (value, record) => {
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase());
        }
    });

    const findPrinterLocation = async (id: string) => {
        try {
            const response = await PrinterApi.getPrinterLocation(id);
            if (response) {
                setLocation(response.data);
            }
        } catch (err) {
            throw err;
        }
    };

    const columns: TableColumnsType<PrinterType> = [
        {
            title: 'Thương hiệu',
            dataIndex: 'brandName',
            width: 150,
            ...getColumnSearchProps('brandName')
        },
        {
            title: 'Loại máy in',
            dataIndex: 'model',
            width: 100,
            ...getColumnSearchProps('model')
        },
        {
            title: 'Mô tả',
            dataIndex: 'shortDescription',
            width: 200
            // ...getColumnSearchProps('upload_date')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'printer_status',
            width: 150,
            render: (value, record) => (
                <>
                    {record.printerStatus === 'MAINTENANCE' ? (
                        <Tag color="red" key={record.id}>
                            {record.printerStatus}
                        </Tag>
                    ) : (
                        <Tag color="green" key={record.id}>
                            {record.printerStatus}
                        </Tag>
                    )}
                </>
            )
            // ...getColumnSearchProps('print_date')
            // ...getColumnSearchProps('print_date')
            // sorter: (a, b) => a.print_date.getTime() - b.print_date.getTime(),
            // render: (date) => date.toLocaleDateString() // Optional: Format date display
        },
        {
            title: 'Vị trí máy in',
            key: 'location',
            width: 150,
            render: (value) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button
                            color="primary"
                            variant="outlined"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setLocationModal(!locationModal), findPrinterLocation(value.locationId);
                            }}
                        ></Button>
                    </Tooltip>
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (value) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button
                            color="primary"
                            variant="outlined"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setOpenModal(!openModal), setPrinter(value);
                            }}
                        ></Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger icon={<DeleteOutlined />}></Button>
                    </Tooltip>
                </Space>
            )
        }
    ];
    const currentData = printers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleOk = () => {
        setOpenModal(false);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        // setDatas(dataSource);
        PrinterApi.getAllPrinters()
            .then((res) => {
                const datasWithKeys = res.data.map((item: PrinterType) => ({
                    ...item, // Spread the existing properties of `item`
                    key: item.id // Add or override the `key` property with a unique identifier
                }));
                setPrinters(datasWithKeys ?? []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div>
            <h1 style={{ color: '#7E7E7E', fontWeight: 'bolder', display: 'flex', justifyContent: 'center', fontSize: '28px', marginTop: '20px', marginBottom: '20px' }}>DANH SÁCH MÁY IN</h1>
            <div style={{ paddingTop: '50px', marginBottom: '120px', paddingLeft: '50px', paddingRight: '50px' }}>
                <Card title={'Danh sách máy in'}>
                    <Table<PrinterType> dataSource={currentData} columns={columns} pagination={false} style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }} rowSelection={rowSelection}></Table>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={printers.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '30']}
                        onShowSizeChange={handlePageSizeChange}
                        style={{
                            marginTop: 16,
                            textAlign: 'center'
                        }}
                    />
                </Card>
            </div>
            <Modal open={openModal} onOk={handleOk} onCancel={handleCancel}>
                <h1>Chi tiết máy in</h1>
                <div className="field">
                    <label htmlFor="brand">Thương hiệu</label>
                    <Input value={printer.brandName} disabled id="brand"></Input>
                </div>
                <div className="field">
                    <label htmlFor="model">Kiểu máy in</label>
                    <Input id="model" value={printer.model} disabled></Input>
                </div>
                <div className="field">
                    <label htmlFor="status">Trạng thái</label>
                    <Input id="status" value={printer.printerStatus} disabled></Input>
                </div>
                <div className="field">
                    <label htmlFor="des">Mô tả</label>
                    <TextArea rows={4} disabled id="des" value={printer.shortDescription}></TextArea>
                </div>
            </Modal>
            {/* Modal for location of printer */}
            <Modal open={locationModal} onOk={() => setLocationModal(false)} onCancel={() => setLocationModal(false)}>
                <h1>Vị trí đặt máy in</h1>
                <div className="field">
                    <label htmlFor="cs">Cơ sở</label>
                    <Input value={location.campusName} disabled id="cs"></Input>
                </div>
                <div className="field">
                    <label htmlFor="hall">Tòa</label>
                    <Input value={location.buildingName} disabled id="hall"></Input>
                </div>
                <div className="field">
                    <label htmlFor="room">Phòng</label>
                    <Input value={location.roomName} disabled id="room"></Input>
                </div>
                <div className="field">
                    <label htmlFor="address">Địa chỉ</label>
                    <Input value={location.campusAdress} disabled id="address"></Input>
                </div>
                <div className="field">
                    <label htmlFor="hotline">Hotline</label>
                    <Input value={location.hotline} disabled id="hotline"></Input>
                </div>
            </Modal>
        </div>
    );
}
