"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

interface Report {
  id: string;
  createdAt: string;
  title: string;
  reportType: string;
  fileName: string;
}

const Page: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:8080/spso/periodic-report/get-all");
        const sortedReports = response.data.data.sort((a: Report, b: Report) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(sortedReports);
      } catch {
        setError("Lỗi khi lấy dữ liệu từ API");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatReportTitle = (title: string) => {
    const yearlyRegex = /Yearly_Report_(\d{4})\.pdf/;
    const yearlyMatch = title.match(yearlyRegex);

    if (yearlyMatch) {
      const year = yearlyMatch[1];
      return `Báo cáo Năm ${year}`;
    }

    const monthlyRegex = /Monthly_Report_(\d{1,2})_(\d{4})\.pdf/;
    const monthlyMatch = title.match(monthlyRegex);

    if (monthlyMatch) {
      const month = parseInt(monthlyMatch[1]);
      const year = monthlyMatch[2];
      const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
      ];

      return `Báo cáo ${months[month - 1]} Năm ${year}`;
    }

    return title;
  };

  const downloadFile = async (reportId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/spso/periodic-report/${reportId}/download`,
        { responseType: "blob" }
      );

      const contentDisposition = response.headers["content-disposition"];
      const matches = contentDisposition?.match(/filename="(.+)"/);
      const filename = matches ? matches[1] : "default_report.pdf";

      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(fileBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.click();
    } catch {
      console.error("Lỗi khi tải tệp");
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page">
      <h1 className="title">Danh sách báo cáo</h1>
      <ul className="report-grid">
        {reports.map((report) => {
          const createdAt = new Date(report.createdAt);
          const formattedDate = createdAt.toLocaleDateString();
          const formattedTitle = formatReportTitle(report.title);

          return (
            <li key={report.id} className="report-item">
              <img
                src="https://img.icons8.com/color/48/000000/pdf.png"
                alt="PDF Icon"
                className="pdf-icon"
              />
              <div className="report-info">
                <h3 className="report-title">{formattedTitle}</h3>
                <p>
                  Tên file:{" "}
                  <a
                    className="report-title-file"
                    onClick={() => downloadFile(report.id)}
                  >
                    {report.title}
                  </a>
                </p>
                <p className="report-type">Loại báo cáo: {report.reportType}</p>
                <p className="report-date">Ngày tạo: {formattedDate}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Page;
