"use client";

import React, { useEffect, useState } from "react";
import PdfIcon from "./pdf.png";
import WordIcon from "./doc.png";
import Cookies from "js-cookie";
import { AUTH_KEY } from "@/lib/services/auth.service";

interface FileItem {
  id: string;
  fileName: string;
  fileType: string;
  totalCostPage: number;
  printSideType: string;
  pageSize: string;
  pageToPrint: object;
  numOfCop: number;
  documentStatus: string;
  uploadDate: string;
}

const UploadedFilesList: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>("");

  const getIconForFile = (file: { fileName: string }) => {
    if (!file.fileName) return undefined;
    const fileExtension = file.fileName.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") return PdfIcon;
    if (fileExtension === "docx" || fileExtension === "doc") return WordIcon;
    return undefined;
  };

  const getCustomerId = () => {
    const authKey = Cookies.get(AUTH_KEY);
    if (authKey) {
      const parsedAuth = JSON.parse(authKey);
      return parsedAuth?.data?.user?.id || "";
    }
    return "";
  };

  useEffect(() => {
    const id = getCustomerId();
    setCustomerId(id);
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);

    const customerId = getCustomerId();
    if (!customerId) {
      setError("Customer ID không hợp lệ.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/customer/document/by-customer?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }
      const data = await response.json();
      const sortedFiles = data.data?.sort((a: FileItem, b: FileItem) => {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }) || [];
      setFiles(sortedFiles);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="uploaded-files-list">
      <div className="Heading">Tệp đính kèm</div>
      <button className="refresh-button" onClick={fetchFiles}>
        Làm mới
      </button>
      <table>
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input type="checkbox" />
            </th>
            <th style={{ textAlign: "left" }}>Tên tập tin</th>
            <th>Loại file</th>
            <th>Khổ giấy</th>
            {/* <th>Ngày đăng tải</th> */}
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td style={{ textAlign: "left" }}>
                <img
                  src={getIconForFile(file)?.src}
                  className="ico2"
                  alt="File Icon"
                />
                {file.fileName}
              </td>
              <td>{file.fileType}</td>
              <td>{file.pageSize}</td>
              {/* <td>{new Date(file.uploadDate).toLocaleDateString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="print-button">In tài liệu</button>
    </div>
  );
};

export default UploadedFilesList;
