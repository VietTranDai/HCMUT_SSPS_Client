"use client"
import React, { useEffect, useState } from 'react';
import PdfIcon from './pdf.png';
import WordIcon from './doc.png';

interface FileItem {
  name: string;
  dateModified: string;
  size: string;
  uploadDate: string;
}

const UploadedFilesList: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { name: '2211738_Lab3a.pdf', dateModified: '24/10/2024', size: '200 KB', uploadDate: '24/10/2024' },
    { name: '2211738_Lab3b.pdf', dateModified: '24/10/2024', size: '200 KB', uploadDate: '24/10/2024' },
  ]);

  const getIconForFile = (file: { name: string }) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'pdf') {
      return PdfIcon;  // Return the image import (StaticImageData)
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      return WordIcon;  // Return the image import (StaticImageData)
    }
    return undefined;  // No icon for other file types
  };
  return (
    <div className="uploaded-files-list">
      <h3>Tệp đính kèm</h3>
      <table>
        <thead>
          <tr>
            <th className="checkbox-cell"><input type="checkbox" /></th>
            <th style={{ textAlign: 'left' }}>Tên tập tin</th>
            <th>Dung lượng</th>
            <th>Ngày đăng tải</th>
            <th>Ngày chỉnh sửa</th>    
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td style={{ textAlign: 'left' }}>
                <img src={getIconForFile(file)?.src} className="ico2" alt="File Icon" />
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
