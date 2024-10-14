<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/phuongngo0320/hcmut-ssps">
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" alt="NestJS Logo" width="140" height="140">
    <img src="hcmut.png" alt="HCMUT Logo" width="160" height="160">
    
  </a>

  <h3 align="center">Student Smart Printing Service Client</h3>

  <p align="center">
    Ứng dụng cung cấp dịch vụ in ấn tiện lợi cho sinh viên
    <br />
    <a href="#getting-started"><strong>Xem hướng dẫn »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về dự án này</a>
      <ul>
        <li><a href="#built-with">Công nghệ sử dụng</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu</a>
      <ul>
        <li><a href="#prerequisites">Điều kiện</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Hướng dẫn sử dụng</a>
      <ul>
        <li><a href="#notes">Một số lưu ý</a></li>
        <li><a href="#functions">Thao tác trong ứng dụng</a></li>
        <li><a href="#errors">Lỗi có thể xảy ra khi sử dụng</a></li>
      </ul>
    </li>
    <li><a href="#contact">Liên hệ</a></li>
    <li><a href="#acknowledgments">Tài liệu tham khảo</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

<a id="about-the-project"></a>

## Về dự án này

SSPS (Student Smart Printing Service) sẽ đáp ứng nhu cầu ngày càng tăng về các giải pháp in ấn hiệu quả, tiện lợi và đáng tin cậy trong khuôn viên trường. Dịch vụ này sử dụng công nghệ để đơn giản hóa quy trình in, cho phép sinh viên in tài liệu từ nhiều thiết bị khác nhau với thời gian chờ đợi tối thiểu. Sinh viên thường xuyên cần in bài tập, báo cáo nghiên cứu và các tài liệu khác, nhưng dịch vụ in truyền thống có thể chậm chạp hoặc bất tiện, đặc biệt là trong các kỳ thi hoặc khi lượng nhu cầu tăng cao. SSPS có thể tối ưu hóa quá trình này, mang đến sự linh hoạt, khả năng kiểm soát tốt hơn đối với các tác vụ in và giảm thiểu sai sót trong việc in ấn, đồng thời người dùng có thể truy cập lưu trữ lịch sử sử dụng dịch vụ.
Với sự phát triển của hệ thống Dịch vụ In thông minh cho Sinh viên (HCMUT_SSPS), trường Đại học Bách Khoa hy vọng sẽ nâng cao hiệu quả quản lý giáo dục, tối ưu hóa quy trình học thuật, và cung cấp một nền tảng hỗ trợ chất lượng cao cho sinh viên và giáo viên của mình. Đây sẽ là một bước tiến quan trọng giúp trường mở rộng quy mô hoạt động giáo dục và tăng cường vị thế cạnh tranh trong lĩnh vực giáo dục đại học.

Thành viên phát triển dự án:

- Trần Đại Việt - phát triển Backend
- Lương Thanh Tùng - phát triển Backend
- Trần Ngọc Châu Long - phát triển Frontend
- Trần Trung Kiên - phát triển Frontend
- Trần Quang Huy - phát triển Frontend
- Lê Đăng Khoa - phát triển Backend

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Công nghệ sử dụng

<a id="built-with"></a>

- **Next.js**: Framework React dùng cho phát triển ứng dụng web với tính năng SSR (Server Side Rendering) và SSG (Static Site Generation).
- **Ant Design**: Thư viện UI component hiện đại và dễ sử dụng cho React.
- **TypeScript**: Tăng cường tính an toàn khi viết code với kiểm tra kiểu tĩnh.
- **Axios**: Thư viện gọi API cho việc giao tiếp giữa client và server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

<a id="getting-started"></a>

## Bắt đầu

<a id="prequite">

### Điều kiện

Trước khi sử dụng ứng dụng, bạn cần cài đặt các phần mềm sau:

**Node.js và npm**:

- Tải xuống và cài đặt Node.js từ [Node.js Official Website](https://nodejs.org/). Quá trình cài đặt Node.js sẽ tự động cài đặt cả npm (Node Package Manager).
- Kiểm tra cài đặt bằng các lệnh sau:
  ```bash
  node -v
  npm -v
  ```
  Đảm bảo rằng phiên bản Node.js và npm đã được cài đặt.

### Cài đặt

Bạn có thể sử dụng ứng dụng thông qua localhost bằng các bước sau:

1. **Lấy mã nguồn từ GitHub**:

   - Truy cập GitHub và tải source code của dự án về bằng cách clone repository:
     ```bash
     git clone <GitHub-Repository-URL>
     ```
   - Thay đổi thư mục làm việc thành thư mục dự án của bạn:
     ```bash
     cd <project-folder>
     ```

2. **Cài đặt thư viện npm**:

   - Tại thư mục gốc của dự án, chạy lệnh sau để cài đặt các thư viện cần thiết:
     ```bash
     npm install
     ```

3. **Khởi động server NestJS**:

- Tải src code bên server về để chạy

  - Chạy lệnh sau để khởi động server của dự án:
    ```bash
    npm run start:dev
    ```
  - Server sẽ khởi động ở chế độ phát triển và lắng nghe ở cổng mà bạn đã chỉ định (ví dụ: cổng `8080` như trong file `.env` của bạn).

4. **Khởi động client NextJS**:

- Chạy lệnh sau để khởi động client của dự án:
  ```bash
  npm run dev
  ```
- Server sẽ khởi động ở chế độ phát triển và lắng nghe ở cổng mà bạn đã chỉ định (ví dụ: cổng `3000` như trong file `.env` của bạn).

---

### Lưu ý:

- Bạn cũng có thể cần kiểm tra phiên bản Node.js để đảm bảo tương thích với các thư viện mà dự án sử dụng.

<!-- USAGE -->

<a id="usage"></a>

## Hướng dẫn sử dụng

Dưới đây là một số lệnh cơ bản để tương tác với NextJS và trong dự án:

### NextJS Commands

- **Chạy ứng dụng NextJS:**

  ```bash
    npm run dev
  ```

  Lệnh này sẽ khởi chạy ứng dụng NextJS. Bạn có thể truy cập ứng dụng qua đường dẫn [http://localhost:3000](http://localhost:8080).

- **Tải những thư viện đã khai báo trong pakage:**

  ```bash
    npm install
  ```

- **Tải những thư viện mới :**
  Chú ý phải tìm chính xác phiên bản của thư viện đó có thể lấy bản mới nhất.
  Sau khi xác định được phiên bản của thư viên muốn tải, ví dụ bạn muốn tải thư viện **@types/react**, hãy lên trình duyệt tìm kiếm **npm @types/react** để xác định phiên bản mới nhất.
  Dùng câu lệnh

  ```bash
    npm install --save-exact <Tên thư viện>@<phiên_bản>
  ```

  Ví dụ:

  ```bash
    npm install --save-exact @types/react@18.3.11
  ```

### Tham khảo thêm

Để biết thêm chi tiết, bạn có thể tham khảo tài liệu chính thức của:

- NextJS: https://nextjs.org/
- Ant Design: https://ant.design/
<p align="right">(<a href="#readme-top">back to top</a>)</p>

**Lưu ý**: Vì ứng dụng vẫn đang trong giai đoạn phát triển nên một số chức năng sẽ không được đầy đủ như mong muốn

<!-- CONTACT -->

<a id="contact"></a>

## Liên hệ

Mọi thắc mắc, báo lỗi, đề xuất tính năng cho ứng dụng xin hay liên hệ qua địa chỉ email: viet.trankhmtbk22@hcmut.edu.vn

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

<a id="acknowledgments"></a>

## Tài liệu tham khảo

1. Sommerville, I. (2016). Software Engineering 10th Edition. Boston: Pearson Education Limited.

2. [Ant Design - The world's second most popular React UI](https://ant.design/)

3. [Next.js by Vercel - The React Framework](https://nextjs.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
