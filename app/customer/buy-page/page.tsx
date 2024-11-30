'use client';

import { Button, InputNumber } from 'antd';
import { Table, Card, Tag } from 'antd';
import type { InputNumberProps, TableColumnsType, TableProps } from 'antd';

import './index.css';
import { MouseEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PurchaseApi, PurchaseBills } from '../services/purchase';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
// import { useAuthContext } from '@/app/hooks/useAuthContext';
import { AUTH_KEY } from '@/lib/services/auth.service'; // Import AUTH_KEY
import Cookies from 'js-cookie';
import { useAuthContext } from '@/app/hooks/useAuthContext';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
    key: number;
    no_of_page: number;
    buy_date: string;
    pay_date: string;
    status: string;
}

export default function Home() {
    // const initialMomoPurchaseResponse: MomoPurchaseResponse = {
    //     partnerCode: 'string',
    //     orderId: '',
    //     requestId: '',
    //     amount: 0,
    //     responseTime: 0,
    //     message: '',
    //     resultCode: 0,
    //     payUrl: '',
    //     deeplink: '',
    //     qrCodeUrl: ''
    // };
    const initialPurchaseBill: PurchaseBills = {
        id: '',
        customerId: '',
        orderId: '',
        transactionTime: '',
        numberOfPage: 0,
        price: 0,
        purchaseStatus: ''
    };

    const Str_random = () => {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 3; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomInd);
        }
        return result;
    };
    // const [data, setData] = useState<DataType>(initialData);
    const [purchases, setPurchases] = useState<PurchaseBills[]>([]);
    const [datas, setDatas] = useState<DataType[]>([]);
    const [noPage, setNoPage] = useState<number>(0);
    // const [i, setI] = useState<number>(8);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<PurchaseBills[]>([]);
    // const [totalCost, setTotalCost] = useState<number>(0);
    const [confirm, setConfirm] = useState<boolean>(false);
    const navigate = useRouter();

    // Related to MOMO
    // const customer_id = '0e103ef5-3694-444e-820b-8aee4c695225';
    const [customerId, setCustomerId] = useState<string>('');
    const [orderId, setOrderId] = useState<string>('');

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

    const handleInsert = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (noPage <= 0 || noPage >= 610) {
            toast.error('Số lượng trang không hợp lệ');
            setNoPage(0);
            return;
        }
        try {
            const randomStr = Str_random();
            setOrderId(`ORD${randomStr}`);
            const response = await PurchaseApi.createNewBill(customerId, noPage * 500, 'ORD' + `${randomStr}`, 'PENDING', noPage);

            if (response) {
                const dataWithKey = { key: response.data.id, ...response.data };
                setPurchases([dataWithKey, ...purchases]);
                toast.success('Đặt mua thành công');
                setNoPage(0);
            }
        } catch (err) {
            toast.error('Đặt mua thất bại');
            throw err;
        }
    };

    const handleOK = () => {
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const handleGetBills = async (customer_id: string) => {
        PurchaseApi.getAllBills(customer_id)
            .then((res) => {
                const datasWithKeys = res.data.map((item: PurchaseBills) => ({
                    ...item, // Spread the existing properties of `item`
                    key: item.id // Add or override the `key` property with a unique identifier
                }));
                setPurchases(datasWithKeys.filter((data) => data.purchaseStatus === 'PENDING') ?? []);
            })
            .catch(() => {
                console.log('Can not fetch the data');
            });
    };

    const handleMomoPurchase = async (orderId: string, totalPrice: number) => {
        try {
            const response = await PurchaseApi.purchaseBill(orderId, totalPrice);
            if (response) {
                console.log(response.data);
                navigate.push(`${response.data.payUrl}`);
            }
        } catch (err) {
            throw err;
        }
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
    const columns: TableColumnsType<PurchaseBills> = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderId',
            width: 150,
            key: 'orderId'
        },
        {
            title: 'Số lượng trang',
            dataIndex: 'numberOfPage',
            width: 150,
            key: 'numberOfPage',
            sorter: (a, b) => a.numberOfPage - b.numberOfPage
        },
        {
            title: 'Ngày thanh toán',
            width: 200,
            dataIndex: 'transactionTime',
            key: 'transactionTime',
            render: (value) => dayjs(value).format('YYYY-MM-DD')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'purchaseStatus',
            width: 150,
            key: 'purchaseStatus',
            render: (_, record) => (
                <>
                    <Tag color="volcano" key={record.id}>
                        {record.purchaseStatus}
                    </Tag>
                </>
            )
        },
        {
            title: 'Tổng (VND)',
            dataIndex: 'numberOfPage',
            width: 150,
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (value) => 500 * value
        }
    ];

    useEffect(() => {
        const authKey = Cookies.get(AUTH_KEY);
        if (authKey) {
            setCustomerId(JSON.parse(authKey as string).data.user.id);
            console.log(JSON.parse(authKey as string).data.user.id);
            if (localStorage.getItem('purchase_id') !== null) {
                const orderId = JSON.parse(localStorage.getItem('purchase_id') || '')?.order_id;
                const pid = JSON.parse(localStorage.getItem('purchase_id') || '')?.pid;
                PurchaseApi.checkTransactionStatus(orderId)
                    .then(async (res) => {
                        if (res.data.message === 'Thành công.') {
                            const response = await PurchaseApi.updateTransactionStatus(pid, 'COMPLETED');
                            try {
                                if (response) {
                                    handleGetBills(JSON.parse(authKey as string).data.user.id);
                                }
                            } catch {
                                console.log('Can not get bills');
                            }
                        }
                        localStorage.removeItem('purchase_id');
                    })
                    .catch(() => {
                        console.log('Can not update the bill');
                        localStorage.removeItem('purchase_id');
                    });
            } else {
                handleGetBills(JSON.parse(authKey as string).data.user.id);
            }
        }
    }, []);
    return (
        <div>
            <h1 style={{ color: '#7E7E7E', fontWeight: 'bolder', display: 'flex', justifyContent: 'center', fontSize: '28px', marginTop: '20px', marginBottom: '20px' }}>MUA TRANG IN</h1>
            <div style={{ paddingLeft: '100px', paddingTop: '50px', marginBottom: '100px' }}>
                <h1 style={{ fontWeight: '400' }}>Số lượng trang</h1>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', marginTop: '30px', width: '1100px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
                    <InputNumber placeholder="Số lượng trang (tối đa: 610 tờ)" style={{ width: '400px', height: '50px', display: 'flex', alignItems: 'center' }} onChange={ChangeNoPage}></InputNumber>
                    <Button style={{ color: 'white', backgroundColor: '#4663B7', height: '50px', width: '150px', fontWeight: '500', marginLeft: '50px' }} onClick={handleInsert}>
                        Đặt mua
                    </Button>
                </div>

                <div style={{ marginTop: '100px' }}>
                    <h1 style={{ fontWeight: '400' }}>Đơn thanh toán</h1>
                    <Card style={{ width: '1100px', marginTop: '30px' }}>
                        <Table<PurchaseBills>
                            dataSource={purchases}
                            key={'purchase-bill'}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={{
                                pageSize: 5
                            }}
                        ></Table>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                style={{ width: '170px', height: '50px', border: '1px solid black', fontSize: '18px', fontWeight: '300' }}
                                disabled={!confirm}
                                onClick={() => {
                                    handleMomoPurchase(selectedRows[0].orderId, selectedRows[0]?.numberOfPage * 500),
                                        localStorage.setItem(
                                            'purchase_id',
                                            JSON.stringify({
                                                order_id: orderId,
                                                pid: selectedRows[0].id
                                            })
                                        );
                                }}
                            >
                                Thanh toán
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* <Modal open={modalOpen} onOk={handleOK} onCancel={handleCancel} footer={footerCustom}>
                <div>
                    <h1 style={{ color: '#4663B7', display: 'flex', justifyContent: 'center', fontSize: '20px', marginTop: '20px', marginBottom: '20px' }}>XÁC NHẬN THANH TOÁN</h1>

                    <div className="modal-content">
                        <div>Số lượng trang</div>
                        <div>
                            {selectedRows[0]?.numberOfPage} <span style={{ fontSize: '20px', marginTop: '10px', marginBottom: '20px' }}>đ</span>
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
            </Modal> */}
        </div>
    );
}
