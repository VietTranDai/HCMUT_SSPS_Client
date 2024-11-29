'use client';

import { Button, InputNumber, ThemeConfig } from 'antd';
import { Table, DatePicker, Modal } from 'antd';
import type { InputNumberProps, TableColumnsType, TableProps } from 'antd';

import './index.css';
import { MouseEvent, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { FilterConfirmProps, FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnType } from 'antd';
import { Input, Space } from 'antd';
import { Card, Pagination } from 'antd';
import dayjs from 'dayjs';

interface DataType {
    key: number;
    no_of_page: number;
    book_date: string;
    pay_date: string;
    total: number;
}

type DataIndex = keyof DataType;

export default function Home() {
    const initialData: DataType = {
        key: 0,
        no_of_page: 0,
        book_date: '',
        pay_date: '',
        total: 0
    };

    // const [data, setData] = useState<DataType>(initialData);
    const default_cost = 500;
    const [datas, setDatas] = useState<DataType[]>([]);
    const [i, setI] = useState<number>(8);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [pageSize, setPageSize] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

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

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                {dataIndex === 'book_date' || dataIndex === 'pay_date' ? (
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
            if (dataIndex === 'book_date' || dataIndex === 'pay_date') {
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

        // filterDropdownProps: {
        //     onOpenChange(open) {
        //         if (open) {
        //             setTimeout(() => searchInput.current?.select(), 100);
        //         }
        //     }
        // }
    });

    const getDecimalPoint = (num: string) => {
        return Number.parseFloat(num).toFixed(2);
    };
    const dataSource: DataType[] = [
        {
            key: 0,
            no_of_page: 500,
            book_date: '2024-10-24',
            pay_date: '2024-10-24',
            total: 500 * default_cost
        },
        {
            key: 1,
            no_of_page: 50,
            book_date: '2024-10-24',
            pay_date: '2024-10-24',
            total: 50 * default_cost
        },
        {
            key: 2,
            no_of_page: 50,
            book_date: '2024-10-24',
            pay_date: '2024-10-26',
            total: 50 * default_cost
        },
        {
            key: 3,
            no_of_page: 50,
            book_date: '2024-10-24',
            pay_date: '2024-10-26',
            total: 50 * default_cost
        }
    ];
    const columns: TableColumnsType<DataType> = [
        {
            title: 'Số lượng trang mua',
            dataIndex: 'no_of_page',
            width: 150,
            ...getColumnSearchProps('no_of_page'),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.no_of_page - b.no_of_page
        },
        {
            title: 'Ngày đặt mua',
            dataIndex: 'book_date',
            width: 200,
            ...getColumnSearchProps('book_date')
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'pay_date',
            width: 150,
            ...getColumnSearchProps('pay_date')
            // ...getColumnSearchProps('print_date')
            // sorter: (a, b) => a.print_date.getTime() - b.print_date.getTime(),
            // render: (date) => date.toLocaleDateString() // Optional: Format date display
        },
        {
            title: 'Tổng số tiền (VND)',
            dataIndex: 'total',
            width: 150,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.total - b.total
        }
    ];

    useEffect(() => {
        setDatas(dataSource);
    }, []);

    const currentData = datas.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return (
        <div>
            <h1 style={{ color: '#7E7E7E', fontWeight: 'bolder', display: 'flex', justifyContent: 'center', fontSize: '28px', marginTop: '20px', marginBottom: '20px' }}>LỊCH SỬ IN</h1>
            <div style={{ paddingTop: '50px', marginBottom: '120px', paddingLeft: '50px', paddingRight: '50px' }}>
                <Card title={'Danh sách lịch sử in'}>
                    <Table<DataType> dataSource={currentData} columns={columns} pagination={false} style={{ boxShadow: '0px 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px' }}></Table>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={datas.length}
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
        </div>
    );
}
