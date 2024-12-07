'use client';
import React, { useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import axios from 'axios';
import PdfIcon from '@/app/assets/pdf.png';
import WordIcon from '@/app/assets/doc.png';
import Cookies from 'js-cookie';
import { AUTH_KEY } from '@/lib/services/auth.service';
import { Button, Card, Progress, Modal, Select, InputNumber, Radio, Input } from 'antd';
import type { RadioChangeEvent, InputNumberProps } from 'antd';
import * as mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import UploadedFilesList from './UploadedFilesList';
import { FileItem } from './page';
import { toast } from 'react-toastify';

interface FileWithPreview extends File {
    preview?: string;
}

interface UploadSectionProps {
    onFileUpload: (fileName: FileItem) => void;
}

const FileUpload: React.FC<UploadSectionProps> = ({ onFileUpload }) => {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [customerId, setCustomerId] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // state cho thiết lập cấu hình
    const [value, setValue] = useState<number>(0); // cho radio button
    const [noPage, setNoPage] = useState<number>(0);
    const [side, setSide] = useState<string>('');
    const [pageSize, setPageSize] = useState<string>('');
    const [neededPage, setNeededPage] = useState<string[]>([]);
    const [noCopy, setNoCopy] = useState<number>(0);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isFullSetup, setIsFullsetup] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<boolean>(false);

    const getCustomerId = () => {
        const authKey = Cookies.get(AUTH_KEY);
        if (authKey) {
            const parsedAuth = JSON.parse(authKey);
            return parsedAuth?.data?.user?.id || '';
        }
        return '';
    };

    // Dùng cho radio button
    // Dùng cho select
    const handleSetSide = (value: string) => {
        // console.log(`selected ${value}`);
        setSide(value);
    };
    const handleSetPageSize = (value: string) => {
        setPageSize(value);
    };
    const onChange: InputNumberProps['onChange'] = (value) => {
        setNoCopy(value as number);
    };

    // Calculate number of pages of file pdf
    async function getNumberOfPages(file: File): Promise<number> {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        return pdfDoc.getPageCount();
    }

    useEffect(() => {
        const id = getCustomerId();
        setCustomerId(id);
    }, []);

    const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
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
        // accept: '*/*',
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 5 * 1024 * 1024
    });

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleConfirm = () => {
        console.log(noCopy, neededPage, side, pageSize);
        setSubmitted(true);
        if (neededPage.length === 0 && !side && !pageSize) {
            console.log('hello');
            setModalOpen(true);
        } else {
            setModalOpen(false);
            setIsFullsetup(true);
        }
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
                printSideType: side,
                pageSize: pageSize,
                pageToPrint: neededPage,
                numOfCop: noCopy,
                fileContent: base64File.split(',')[1]
            };

            const response = await axios.post('http://localhost:8080/customer/document/create', payload);

            if (response.status === 201) {
                onFileUpload(response.data.data);
                // setSuccessMessage('Tài liệu đã được tạo thành công! Vui lòng ấn vào nút làm mới.');
                toast.success('Đăng tải tập tin thành công!');
                setFile(null);
                // setFile(response.data);
                setErrorMessage('');
                setUploadedFile(true);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 10000);
            } else {
                setErrorMessage('Có lỗi xảy ra khi tải lên.');
            }
        } catch (error) {
            console.error('Lỗi khi tải lên:', error);
            setErrorMessage('Lỗi tải lên tệp. Vui lòng thử lại.');
            setSuccessMessage('');
        }
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

    const getNoPages = async (file: File) => {
        try {
            const res = await getNumberOfPages(file);

            setNoPage(res);
            console.log(res);
        } catch {
            console.log('Can not get no page of file');
        }
    };

    return (
        <div style={{ height: '350px' }}>
            <Card style={{ width: '100%' }}>
                {/* <h1 style={{ fontWeight: '400', marginBottom: '20px' }}>Đăng tải tài liệu</h1> */}
                <div style={{ border: '2px dashed #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                    <div {...getRootProps()} className="upload-area">
                        <input {...getInputProps()} />
                        <strong style={{ margin: '10px' }}>Thả tập tin vào đây để tải lên</strong>
                        <p style={{ fontWeight: '100', fontSize: '17px' }}>Kích thước tập tin tải lên (tối đa 5 MB) và các loại tập tin được phép tải lên (.docx, .pdf, .doc)</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button style={{ backgroundColor: '#4663b7', color: 'white', fontWeight: '500', width: '150px', height: '50px', fontSize: '18px', marginTop: '15px' }}>Đăng tải</Button>
                        </div>
                    </div>
                </div>
            </Card>
            <Card style={{ marginTop: '30px', height: '200px' }} title="Đăng tải tập tin">
                {file ? (
                    <div style={{ display: 'flex' }}>
                        <div>
                            <img src={getIconForFile(file)?.src} className="ico" alt="File Icon" />
                        </div>
                        <div style={{ width: '100%', paddingLeft: '10px' }}>
                            <p style={{ fontSize: '18px', fontWeight: '400' }}>{file.name}</p>
                            <p>{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                <div>
                                    <Button
                                        onClick={() => {
                                            setModalOpen(!modalOpen), getNoPages(file), setConfirm(false);
                                        }}
                                    >
                                        Thiết lập cấu hình
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ marginLeft: '20px' }}
                                        onClick={() => {
                                            setConfirm(true);
                                            if (isFullSetup) {
                                                handleUpload();
                                            } else {
                                                setIsFullsetup(false);
                                            }
                                        }}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                                {confirm && !isFullSetup && <small style={{ color: 'red' }}>Bạn chưa cài đặt đầy đủ trong phần thiết lập trang in trước khi đăng tải tập tin</small>}
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="error-message" style={{ color: 'red' }}>
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="success-message" style={{ color: 'green' }}>
                                {successMessage}
                            </div>
                        )}
                    </div>
                ) : (
                    'Chưa có tập tin nào được đăng tải'
                )}
            </Card>
            <Modal
                title="Thiết lập trang"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={() => (
                    <>
                        <Button
                            onClick={() => {
                                setModalOpen(false), setNoPage(0), setSubmitted(false);
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                // setModalOpen(false);
                                handleConfirm();
                            }}
                        >
                            Xác nhận
                        </Button>
                    </>
                )}
                width={600}
                height={1000}
            >
                <div className="same-field">
                    <label>
                        Cỡ trang <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="field">
                        <div>
                            <Select
                                id="size"
                                placeholder="Chọn cỡ trang"
                                style={{ width: 150 }}
                                onChange={handleSetPageSize}
                                options={[
                                    { value: 'A3', label: 'A3' },
                                    { value: 'A4', label: 'A4' }
                                ]}
                                status={submitted && !pageSize ? 'error' : ''}
                            ></Select>
                        </div>

                        {submitted && !pageSize && <small style={{ color: 'red' }}>Bạn chưa chọn kích cỡ trang</small>}
                    </div>
                </div>
                <div className="same-field">
                    <label>
                        Kiểu in <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="field">
                        <div>
                            <Select
                                id="sided"
                                placeholder="Chọn kiểu in"
                                onChange={handleSetSide}
                                style={{ width: 150 }}
                                options={[
                                    { label: 'Một mặt', value: 'SINGLE_SIDE' },
                                    { label: 'Hai mặt', value: 'DOUBLE_SIDE' }
                                ]}
                                status={submitted && !side ? 'error' : ''}
                            ></Select>
                        </div>

                        {submitted && !side && <small style={{ color: 'red' }}>Bạn chưa chọn kiểu in</small>}
                    </div>
                </div>
                <div className="same-field">
                    <label>
                        Trang cần in <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="field">
                        <div>
                            <Input
                                id="needed-page"
                                placeholder="Trang cần in"
                                style={{ width: '200px' }}
                                value={neededPage}
                                onChange={(e) => {
                                    const temp = e.target.value.split(',');
                                    setNeededPage(temp.filter((page) => !isNaN(Number(page)) && Number(page) <= noPage));
                                }}
                                status={submitted && !neededPage ? 'error' : ''}
                            ></Input>
                        </div>
                        {submitted && neededPage.length === 0 && <small>Bạn chưa chọn trang cần in</small>}
                    </div>
                </div>
                <div className="same-field">
                    <label>Số lượng bản sao</label>
                    <InputNumber id="copy" placeholder="Số lượng bản sao" style={{ width: '200px' }} value={noCopy} onChange={onChange}></InputNumber>
                </div>
            </Modal>

            {/* <UploadedFilesList /> */}
        </div>
    );
};

export default FileUpload;
