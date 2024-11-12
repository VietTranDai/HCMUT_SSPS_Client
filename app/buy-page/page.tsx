import { Button } from "antd";
import AuthWrapper from '@/lib/helpers/AuthWrapper';

export default function Home() {
    return <AuthWrapper>
        <div style={{
        height: '600px',
        width: '500px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#f6f6f6'
    }}>
        <link href='https://fonts.googleapis.com/css?family=Nunito'></link>
        <div style={{
            padding: '5% 15% 5% 15%',
            height: '5%',
            width: '70%',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{
                paddingTop: '25px',
                textAlign: 'center',
                fontFamily: 'Arial', 
                fontWeight: 'bold',
                fontSize: '17px',
                color: '#818181'
            }}>MUA TRANG IN</div>
        </div>
        <div style={{
            padding: '0px 15% 0px 15%',
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            height: '20%',
            width: '70%'
        }}>
            <div style={{
                fontSize: '17px',
                height: '10%',
                paddingBottom: '5%'
            }}>
            <text>Số lượng trang</text>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                height: '40%'
            }}>
                <div style={{
                    height: '100%',
                    width: '60%',
                    paddingTop: '2px'
                }}>
                    <input type="text" placeholder="Số lượng trang tối đa: 6100 tờ" style={{
                        height: '40%',
                        width: '95%'
                        
                    }}></input>
                </div>
                <div style={{
                    height: '100%',
                    width: '40%',
                    paddingLeft: '20px',
                    paddingTop: '3px'
                }}>
                    <Button type="primary" style={{
                        backgroundColor: '#4663B7',
                        color: 'white',
                        width: '90%',
                        height: '47%'
                    }}>Đặt mua</Button>
                    
                </div>
            </div>
        </div>
        <div style={{
            padding: '0px 15% 0px 15%',
            margin: 'auto',
            height: '60%',
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left'
        }}>
            <div style={{
                margin: 'auto',
                height: '10%',
                width: '100%',
            }}>
                Đơn thanh toán
            </div>
            <div style={{
                margin: 'auto',
                height: '80%',
                width: '100%',
            }}>
                <table style={{
                    fontSize: '10px',
                    textAlign: 'center'
                }}>
                    <tr>
                    <th style={{
                            width: '5%',
                            paddingBottom: '20px'
                        }}>
                            <input type="checkbox" id="buypage"></input>
                        </th>
                        <th style={{
                            width: '25%'
                        }}>
                            Số lượng trang
                        </th>
                        <th style={{
                            width: '15%'
                        }}>
                            Ngày mua
                        </th>
                        <th style={{
                            width: '20%'
                        }}>
                            Ngày thanh toán
                        </th>
                        <th style={{
                            width: '20%'
                        }}>
                            Trạng thái
                        </th>
                    </tr>
                    <tr>
                        <td>
                        <input type="checkbox" id="buypage"></input>
                        </td>
                        <td>
                            5000
                        </td>
                        <td>
                            24/10/2024
                        </td>
                        <td>
                            Chưa xác định 
                        </td>
                        <td>
                            Chưa thanh toán
                        </td>
                    </tr>
                </table>
            </div>
            <div style={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'right',
                padding: '0px 15% 0px 15%',
                width: '100%',
            }}>
                <div style={{
                    width: '70%'
                }}></div>
                <div>
                    <Button type="default" variant="outlined" style={{
                        fontSize: '10px'
                    }}>Thanh toán</Button>
                </div>
            </div>
        </div>
    </div>;
    </AuthWrapper>;
}
