"use client";
import React, { useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios from 'axios';
import PdfIcon from './pdf.png';
import WordIcon from './doc.png';
import Cookies from 'js-cookie';
import { AUTH_KEY } from '@/lib/services/auth.service';

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [customerId, setCustomerId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const getCustomerId = () => {
    const authKey = Cookies.get(AUTH_KEY);
    if (authKey) {
      const parsedAuth = JSON.parse(authKey);
      return parsedAuth?.data?.user?.id || '';
    }
    return '';
  };

  useEffect(() => {
    const id = getCustomerId();
    setCustomerId(id);
  }, []);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setErrorMessage('');
    setUploadProgress(0);

    if (rejectedFiles.length > 0) {
      setErrorMessage(
        'File không hợp lệ. Vui lòng chọn tệp với kích thước nhỏ hơn 5MB và định dạng .doc, .docx, hoặc .pdf.'
      );
      setFile(null);
    } else {
      setFile(acceptedFiles[0] as FileWithPreview);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Vui lòng chọn một tệp để tải lên.');
      return;
    }

    try {
      const base64File = await convertToBase64(file);

      const payload = {
        customerId,
        fileName: file.name,
        fileType: file.type.split('/')[1],
        printSideType: 'SINGLE_SIDE',
        pageSize: 'A4',
        pageToPrint: [1, 2, 3],
        numOfCop: 2,
        fileContent: base64File.split(',')[1],
      };

      const response = await axios.post(
        'http://localhost:8080/customer/document/create',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Tài liệu đã được tạo thành công! Vui lòng ấn vào nút làm mới.');
        setFile(null);
        setUploadProgress(0);
        setErrorMessage('');
      } else {
        setErrorMessage('Có lỗi xảy ra khi tải lên.');
      }
    } catch (error) {
      console.error('Lỗi khi tải lên:', error);
      setErrorMessage('Lỗi tải lên tệp. Vui lòng thử lại.');
      setSuccessMessage('');
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleUpload();
  };

  const getIconForFile = (file: { name: string }) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'pdf') {
      return PdfIcon;
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      return WordIcon;
    }
    return undefined;
  };

  return (
    <div className="upload-section">
      <div className="Heading">Đăng tải tài liệu</div>
      <div {...getRootProps()} className="upload-area">
        <input {...getInputProps()} />
        <strong style={{ margin: '10px' }}>Thả tập tin vào đây để tải lên</strong>
        <p>Kích thước tập tin tải lên (tối đa 5 MB) và các loại tập tin được phép tải lên (.docx, .pdf, .doc)</p>
        <button onClick={handleButtonClick} className="upload-button">
          Đăng tải
        </button>
      </div>
      <br />
      {file && (
        <div className="displayfile-area">
          <div className="column1">
            <img src={getIconForFile(file)?.src} className="ico" alt="File Icon" />
          </div>
          <div className="column2">
            <p>{file.name}</p>
            <p>{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        </div>
      )}
      {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
};

export default FileUpload;
