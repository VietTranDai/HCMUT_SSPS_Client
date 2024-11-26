"use client"
import React, { useState } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import axios from 'axios';
import PdfIcon from './pdf.png';
import WordIcon from './doc.png';

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Clear previous error and progress when a new file is selected
    setErrorMessage('');
    setUploadProgress(0);

    if (rejectedFiles.length > 0) {
      setErrorMessage('File không hợp lệ. Vui lòng chọn tệp với kích thước nhỏ hơn 5MB và định dạng .doc, .docx, hoặc .pdf.');
      setFile(null);
    } else {
      setFile(acceptedFiles[0] as FileWithPreview);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
    maxSize: 5 * 1024 * 1024, // 5 MB
  });

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Vui lòng chọn một tệp để tải lên.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      if (response.status === 200) {
        console.log('Tệp đã được tải lên thành công:', response.data);
        setFile(null);
        setUploadProgress(0); // Reset progress after successful upload
      } else {
        setErrorMessage('Có lỗi xảy ra khi tải lên.');
      }
    } catch (error) {
      console.error('Lỗi khi tải lên:', error);
      setErrorMessage('Lỗi tải lên tệp. Vui lòng thử lại.');
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
    <div className='upload-section'>
      <div className='Heading'>Đăng tải tài liệu</div>
      <div {...getRootProps()} className='upload-area'>
        <input {...getInputProps()} />
        <strong style={{ margin: '10px' }}>Thả tập tin vào đây để tải lên</strong>
        <p>Kích thước tập tin tải lên (tối đa 5 MB) và các loại tập tin được phép tải lên (.docx, .pdf, .doc)</p>
        <button onClick={handleButtonClick} className='upload-button'>
          Đăng tải
        </button>
      </div>
      <br />
      {file && (
        <div className='displayfile-area'>
          <div className='column1'>
            <img src={getIconForFile(file)?.src} className='ico' alt="File Icon" />
          </div>
          <div className='column2'>
            <p>{file.name}</p>
            <p>{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        </div>
      )}
      {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default FileUpload;
