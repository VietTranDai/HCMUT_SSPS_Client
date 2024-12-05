'use client';

import { Button, Tag, Table, DatePicker, Input, Space, Card, Pagination, Tooltip, Modal } from 'antd';
import type { InputNumberProps, TableColumnsType, TableProps } from 'antd';
import './index.css';
import { useEffect, useState, useRef } from 'react';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnType } from 'antd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { PurchaseApi, PurchaseBills } from '../services/purchase';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
type DataIndex = keyof PurchaseBills;

export default function Home() {
    const initialPurchase: PurchaseBills = {
        id: '',
        customerId: '',
        orderId: '',
        transactionTime: '',
        numberOfPage: 0,
        price: 0,
        purchaseStatus: ''
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<PurchaseBills[]>([]);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Purchase bill
    const customer_id = '0e103ef5-3694-444e-820b-8aee4c695225';
    const [purchases, setPurchases] = useState<PurchaseBills[]>([]);
    const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
    const [purchase, setPurchase] = useState<PurchaseBills>(initialPurchase);

    // handle crud purchase
    const handleDeletePurchase = async (id: string) => {
        try {
            const response = await PurchaseApi.deletePurchaseBill(id);

            if (response) {
                setPurchases(purchases.filter((p) => p.id !== id));
                toast.success('Xóa đơn thành công');
            }
        } catch (err) {
            toast.error('Xóa đơn thất bại');
            throw err;
        }
    };

    // handle select row of table
    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: PurchaseBills[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
        setConfirm(!confirm);
    };

    const rowSelection: TableRowSelection<PurchaseBills> = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: selectedRowKeys.length > 0 && !selectedRowKeys.includes(record.id)
        })
    };

    // Handle page change
    const handlePageSizeChange = (current: number, value: number) => {
        setPageSize(value);
        setCurrentPage(1); // Reset to the first page when page size changes
    };

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

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<PurchaseBills> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                {dataIndex === 'transactionTime' ? (
                    <DatePicker
                        style={{ marginBottom: 8, display: 'block' }}
                        value={selectedKeys[0]}
                        onChange={(dateString) => {
                            setSelectedKeys(dateString ? [dateString as string] : []);
                        }}
                    ></DatePicker>
                ) : (
                    <Input
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                        ref={searchInput}
                    />
                )}
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
            if (dataIndex === 'transactionTime') {
                // Compare dates as strings or moments
                const recordDate = record[dataIndex]; // Convert to YYYY-MM-DD
                const dateObject = dayjs(value.toString());
                const formattedDate = dateObject.format('YYYY-MM-DD');
                // console.log(formattedDate);
                return recordDate === formattedDate;
            }
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase());
        }
    });

    const columns: TableColumnsType<PurchaseBills> = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderId',
            width: 150,
            key: 'orderId'
        },
        {
            title: 'Số lượng trang mua',
            dataIndex: 'numberOfPage',
            width: 150,
            ...getColumnSearchProps('numberOfPage'),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.numberOfPage - b.numberOfPage
        },
        {
            title: 'Ngày đặt mua',
            dataIndex: 'transactionTime',
            width: 200,
            render: (value) => dayjs(value).format('YYYY-MM-DD'),
            ...getColumnSearchProps('transactionTime'),
            sorter: (a, b) => new Date(a.transactionTime).getTime() - new Date(b.transactionTime).getTime()
        },
        {
            title: 'Trạng thái',
            dataIndex: 'purchaseStatus',
            width: 200,
            render: (_, record) => (
                <>
                    <Tag color="green" key={record.id}>
                        {record.purchaseStatus}
                    </Tag>
                </>
            )
        },
        {
            title: 'Tổng số tiền (VND)',
            dataIndex: 'numberOfPage',
            width: 150,
            defaultSortOrder: 'descend',
            sorter: (a, b) => (a.numberOfPage - b.numberOfPage) * 500,
            render: (value) => value * 500
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
                                setPurchaseModal(!purchaseModal), setPurchase(value);
                            }}
                        ></Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger icon={<DeleteOutlined />} onClick={() => handleDeletePurchase(value.id)}></Button>
                    </Tooltip>
                </Space>
            )
        }
    ];

    useEffect(() => {
        PurchaseApi.getAllBills(customer_id).then((res) => {
            const dataWithKeys = res.data.map((item: PurchaseBills) => ({
                ...item,
                key: item.id
            }));
            setPurchases(dataWithKeys.filter((bill) => bill.purchaseStatus === 'COMPLETED'));
        });
    }, []);

    const currentData = purchases.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
        <div>
            <h1 style={{ color: '#7E7E7E', fontWeight: 'bolder', display: 'flex', justifyContent: 'center', fontSize: '28px', marginTop: '20px', marginBottom: '20px' }}>LỊCH SỬ IN</h1>
            <div style={{ paddingTop: '50px', marginBottom: '120px', paddingLeft: '50px', paddingRight: '50px' }}>
                <Card title={'Danh sách lịch sử in'}>
                    <Table<PurchaseBills> dataSource={currentData} columns={columns} pagination={false} rowSelection={rowSelection} style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}></Table>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={purchases.length}
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
            <Modal open={purchaseModal} onOk={() => setPurchaseModal(false)} onCancel={() => setPurchaseModal(false)}>
                <h1>Chi tiết đơn đặt mua trang in</h1>
                <div className="field">
                    <label htmlFor="order-id">Mã đơn</label>
                    <Input id="order-id" disabled value={purchase.orderId}></Input>
                </div>
                <div className="field">
                    <label htmlFor="no-page">Số lượng trang mua</label>
                    <Input id="no-page" disabled value={purchase.numberOfPage}></Input>
                </div>
                <div className="field">
                    <label htmlFor="buy-date">Ngày đặt mua</label>
                    <Input id="buy-date" disabled value={dayjs(purchase.transactionTime).format('YYYY-MM-DD')}></Input>
                </div>
                <div className="field">
                    <label htmlFor="total-cost">Tổng số tiền</label>
                    <Input id="total-cost" disabled value={purchase.numberOfPage * 500}></Input>
                </div>
            </Modal>
        </div>
    );
}
