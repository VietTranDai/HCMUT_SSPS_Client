'use client';

import { Button, InputNumber, ThemeConfig } from 'antd';
import { Table, DatePicker, Modal, Card } from 'antd';
import type { InputNumberProps, TableColumnsType, TableProps } from 'antd';

import './index.css';
import { MouseEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
    key: number;
    no_of_page: number;
    buy_date: string;
    pay_date: string;
    status: string;
}

export default function Home() {
    const initialData: DataType = {
        key: 0,
        no_of_page: 0,
        buy_date: '',
        pay_date: '',
        status: ''
    };

    // const [data, setData] = useState<DataType>(initialData);
    const [datas, setDatas] = useState<DataType[]>([]);
    const [noPage, setNoPage] = useState<number>(0);
    const [i, setI] = useState<number>(8);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [confirm, setConfirm] = useState<boolean>(false);

    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: DataType[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
        setConfirm(!confirm);
        // Extract the 'no_of_page' values from selected rows
        // const selectedNoOfPages = newSelectedRows.map((row) => row.no_of_page);
        // console.log('Selected no_of_page values:', selectedNoOfPages);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: selectedRowKeys.length > 0 && !selectedRowKeys.includes(record.key)
        })
    };

    const handleInsert = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (noPage <= 0 || noPage >= 610) {
            toast.error('Số lượng trang không hợp lệ');
            setNoPage(0);
            return;
        }
        // setData({ key: noPage, buy_date: '25/ 10/ 2024', pay_date: 'Chưa xác định', status: 'Chưa thanh toán', no_of_page: noPage });
        // console.log(data);
        setDatas([{ key: i, buy_date: '25/ 10/ 2024', pay_date: 'Chưa xác định', status: 'Chưa thanh toán', no_of_page: noPage }, ...datas]);
        setI(i + 1);
        setNoPage(0);
        toast.success('Đặt mua thành công');
    };

    const handleOK = () => {
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const handlePayment = () => {
        setModalOpen(true);
        setTotalCost(500 * selectedRows[0].no_of_page);
    };

    const handleConfirm = () => {
        setModalOpen(false);
        toast.success('Thanh toán thành công');
        setDatas(datas.filter((val) => val.key !== selectedRowKeys[0]));
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setConfirm(false);
    };

    const ChangeNoPage: InputNumberProps['onChange'] = (value) => {
        setNoPage(value as number);
    };
    const footerCustom = () => {
        return (
            <>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button onClick={handleConfirm}>Xác nhận</Button>
            </>
        );
    };
    const dataSource: DataType[] = [
        {
            key: 1,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 2,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 3,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 4,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 5,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 6,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        },
        {
            key: 7,
            no_of_page: 500,
            buy_date: '24/ 10/ 2024',
            pay_date: 'Chưa xác định',
            status: 'Chưa thanh toán'
        }
    ];
    const columns = [
        {
            title: 'Số lượng trang',
            dataIndex: 'no_of_page',
            width: 150
        },
        {
            title: 'Ngày mua',
            dataIndex: 'buy_date',
            width: 200
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'pay_date',
            width: 200
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150
        }
    ];

    useEffect(() => {
        setDatas(dataSource);
    }, []);
    return (
        <div>
            <h1 style={{ color: '#7E7E7E', fontWeight: 'bolder', display: 'flex', justifyContent: 'center', fontSize: '28px', marginTop: '20px', marginBottom: '20px' }}>MUA TRANG IN</h1>
            <div style={{ paddingLeft: '100px', paddingTop: '50px', marginBottom: '100px' }}>
                <h1 style={{ fontWeight: '400' }}>Số lượng trang</h1>
                {/* <Card style={{ display: 'flex', width: '1100px' }}>
                    <InputNumber placeholder="Số lượng trang (tối đa: 610 tờ)" style={{ width: '350px', display: 'flex', alignItems: 'center' }} onChange={ChangeNoPage}></InputNumber>
                    <Button style={{ color: 'white', backgroundColor: '#4663B7', height: '50px', width: '150px', fontWeight: '500', marginLeft: '50px' }} onClick={handleInsert}>
                        Đặt mua
                    </Button>
                </Card> */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', marginTop: '30px', width: '1100px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                    <InputNumber placeholder="Số lượng trang (tối đa: 610 tờ)" style={{ width: '400px', height: '50px', display: 'flex', alignItems: 'center' }} onChange={ChangeNoPage}></InputNumber>
                    <Button style={{ color: 'white', backgroundColor: '#4663B7', height: '50px', width: '150px', fontWeight: '500', marginLeft: '50px' }} onClick={handleInsert}>
                        Đặt mua
                    </Button>
                </div>

                <div style={{ marginTop: '100px' }}>
                    <h1 style={{ fontWeight: '400' }}>Đơn thanh toán</h1>
                    {/* <div style={{ width: '1100px', marginTop: '30px', border: '1px solid red' }}>
                        <Table<DataType>
                            dataSource={datas}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={{
                                pageSize: 5
                            }}
                        ></Table>
                        <div style={{ display: 'flex', justifyContent: 'end', width: '1100px' }}>
                            <Button style={{ width: '170px', height: '50px', border: '1px solid black', fontSize: '18px', fontWeight: '300' }} disabled={!confirm} onClick={handlePayment}>
                                Thanh toán
                            </Button>
                        </div>
                    </div> */}
                    <Card style={{ width: '1100px', marginTop: '30px' }}>
                        <Table<DataType>
                            dataSource={datas}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={{
                                pageSize: 5
                            }}
                        ></Table>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button style={{ width: '170px', height: '50px', border: '1px solid black', fontSize: '18px', fontWeight: '300' }} disabled={!confirm} onClick={handlePayment}>
                                Thanh toán
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal open={modalOpen} onOk={handleOK} onCancel={handleCancel} footer={footerCustom}>
                <div>
                    <h1 style={{ color: '#4663B7', display: 'flex', justifyContent: 'center', fontSize: '20px', marginTop: '20px', marginBottom: '20px' }}>XÁC NHẬN THANH TOÁN</h1>

                    <div className="modal-content">
                        <div>Số lượng trang</div>
                        <div>
                            {selectedRows[0]?.no_of_page} <span style={{ fontSize: '20px', marginTop: '10px', marginBottom: '20px' }}>đ</span>
                        </div>
                    </div>
                    <div className="modal-content">
                        <div>Đơn giá</div>
                        <div>
                            {500}
                            <span style={{ fontSize: '20px', marginTop: '10px', marginBottom: '20px' }}>đ</span>
                        </div>
                    </div>
                    <div style={{ border: '1px solid #000000' }}></div>
                    <div className="modal-content">
                        <div>Tổng cộng</div>
                        <div>
                            {totalCost} <span style={{ textDecoration: 'underline' }}>đ</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
