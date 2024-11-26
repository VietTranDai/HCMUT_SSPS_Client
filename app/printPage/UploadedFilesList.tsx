"use client";
import React, { useEffect, useState } from "react";
import PdfIcon from "./pdf.png";
import WordIcon from "./doc.png";

interface FileItem {
  name: string;
  dateModified: string;
  size: string;
  uploadDate: string;
}

const UploadedFilesList: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getIconForFile = (file: { name: string }) => {
    if (file.name === undefined)
      return undefined;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return PdfIcon;
    } else if (fileExtension === "docx" || fileExtension === "doc") {
      return WordIcon;
    }
    return undefined;
  };

  useEffect(() => {
    // Replace with your API URL
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://673c001a96b8dcd5f3f82946.mockapi.io/api/a1/file"); // Thay URL API ở đây
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        const data: FileItem[] = await response.json();
        setFiles(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

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
      <table>
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input type="checkbox" />
            </th>
            <th style={{ textAlign: "left" }}>Tên tập tin</th>
            <th>Dung lượng</th>
            <th>Ngày đăng tải</th>
            <th>Ngày chỉnh sửa</th>
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
                {file.name}
              </td>
              <td>{file.size}</td>
              <td>{file.uploadDate}</td>
              <td>{file.dateModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="print-button">In tài liệu</button>
    </div>
  );
};

export default UploadedFilesList;
