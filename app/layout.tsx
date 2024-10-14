import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"; // Đảm bảo rằng bạn đã định nghĩa đúng các CSS cơ bản
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toastify

// Tải font tùy chỉnh
const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // Đường dẫn tới font
  variable: "--font-geist-sans", // Tên biến cho font Geist Sans
  weight: "100 900", // Đặt các khoảng trọng lượng font
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono", // Tên biến cho font Geist Mono
  weight: "100 900",
});

// Metadata cho trang
export const metadata: Metadata = {
  title: "HCMUT SSPS",
  description: "Generated by create next app",
};

// Component Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* ToastContainer để hiển thị các thông báo Toastify */}
        <ToastContainer />
        {/* Ant Design Registry để render các component Ant Design */}
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
