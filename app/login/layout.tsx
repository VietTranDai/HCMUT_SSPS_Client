'use client';

import React from 'react';
import { Layout, Button, Typography } from 'antd';
import Image from 'next/image'; // Sử dụng Next.js Image cho logo
import DefaultLayout from '../default-layout/DefaultLayout';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const LoginLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>{children}</div>

        // <Layout
        //     style={{
        //         backgroundImage: 'url(/images/login/backkhoa.png)', // Đường dẫn tới ảnh nền
        //         backgroundSize: 'cover', // Ảnh bao phủ toàn bộ trang
        //         backgroundPosition: 'center', // Căn giữa ảnh
        //         backgroundRepeat: 'no-repeat', // Không lặp lại ảnh
        //         minHeight: '100vh' // Chiều cao tối thiểu của toàn bộ trang
        //     }}
        // >
        //     {/* Header */}
        //     <Header
        //         style={{
        //             position: 'sticky',
        //             top: 0,
        //             zIndex: 1,
        //             width: '100%',
        //             display: 'flex',
        //             justifyContent: 'space-between',
        //             alignItems: 'center',
        //             backgroundColor: '#ffffff', // Màu trắng cho header
        //             padding: '0 20px',
        //             height: '80px' // Tăng chiều cao của header
        //         }}
        //     >
        //         {/* Logo và tên LoginLayout */}
        //         <div style={{ display: 'flex', alignItems: 'center' }}>
        //             <Image src="/images/login/01_logobachkhoatoi.png" alt="SSPS Logo" width={80} height={60} />
        //             <Title
        //                 level={3}
        //                 style={{
        //                     color: '#007bff', // Đổi màu thành xanh dương cho chữ "SSPS"
        //                     marginLeft: '10px',
        //                     marginBottom: '0'
        //                 }}
        //             >
        //                 HCMUT SSPS
        //             </Title>
        //         </div>

        //         {/* Nút Đăng nhập */}
        //         <Button type="primary" size="large">
        //             Đăng nhập
        //         </Button>
        //     </Header>

        //     {/* Content */}
        //     <Content
        //         style={{
        //             padding: '0 48px',
        //             backgroundSize: 'cover',
        //             backgroundPosition: 'center',
        //             minHeight: 'calc(100vh - 80px - 70px)' // Chiều cao tối thiểu tính trừ header và footer
        //         }}
        //     >
        //         <div
        //         //   style={{
        //         //     padding: 24,
        //         //     minHeight: 380,
        //         //     background: "rgba(255, 255, 255, 0.8)", // Làm nền trắng cho nội dung với độ trong suốt
        //         //     borderRadius: "10px",
        //         //     marginTop: "20px",
        //         //   }}
        //         >
        //             {children} {/* Nội dung con sẽ được chèn vào đây */}
        //         </div>
        //     </Content>

        //     {/* Footer */}
        //     <Footer
        //         style={{
        //             textAlign: 'center',
        //             backgroundColor: 'transparent' // Footer background transparent
        //         }}
        //     >
        //         <div
        //             className="layout-footer"
        //             style={{
        //                 display: 'flex',
        //                 justifyContent: 'center', // Center the image and text horizontally
        //                 alignItems: 'center' // Align the image and text vertically
        //             }}
        //         >
        //             <img
        //                 src="/images/layout/bku.png"
        //                 alt="Logo"
        //                 height="20" // Adjust the size of the logo
        //                 style={{ marginRight: '8px' }} // Add some space between the image and text
        //             />
        //             <span
        //                 style={{
        //                     fontSize: '12px', // Adjust the font size for the text
        //                     fontWeight: '500' // Set the font weight
        //                 }}
        //             >
        //                 Đại học Bách khoa TPHCM
        //             </span>
        //         </div>
        //     </Footer>
        // </Layout>
    );
};

export default LoginLayout;
