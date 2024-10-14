// import hash from "object-hash";

// // Kiểu dữ liệu lưu trữ trong localStorage, có thể kèm hash (tuỳ chọn)
// type LocalStorageItem<T> = {
//   data: T; // Dữ liệu lưu trữ
//   hash?: string; // Giá trị hash dùng để xác thực (nếu cần)
// };

// // Cấu trúc đối tượng dùng để tạo hash, dựa trên dữ liệu và user agent của trình duyệt
// type Hash<T> = {
//   data: T; // Dữ liệu cần hash
//   userAgent: string; // Chuỗi userAgent của trình duyệt
// };

// // Hàm lấy dữ liệu từ localStorage
// export function getItem<T>(key: string): T | null {
//   // Lấy mục từ localStorage theo key
//   const item = localStorage.getItem(key);

//   // Nếu không có dữ liệu, trả về null
//   if (!item) return null;

//   // Chuyển chuỗi JSON thành đối tượng LocalStorageItem
//   const parsedObject = JSON.parse(item) as LocalStorageItem<T>;

//   // Nếu không có hash, chỉ trả về dữ liệu mà không cần xác thực
//   if (!parsedObject.hash) return parsedObject.data;

//   // Tạo đối tượng hash với dữ liệu và userAgent hiện tại của trình duyệt
//   const hashObject: Hash<T> = {
//     data: parsedObject.data,
//     userAgent: navigator.userAgent,
//   };

//   // Tính giá trị hash từ đối tượng trên
//   const hashValue = hash(hashObject);

//   // So sánh hash tính toán với hash được lưu trữ, nếu giống nhau thì trả về dữ liệu
//   if (hashValue === parsedObject.hash) return parsedObject.data;

//   // Nếu hash không khớp, xoá dữ liệu khỏi localStorage (dữ liệu có thể không hợp lệ)
//   localStorage.removeItem(key);
//   return null; // Trả về null nếu dữ liệu không hợp lệ
// }

// // Hàm lưu trữ dữ liệu vào localStorage
// export function setItem<T>(key: string, value: T, hashed?: boolean) {
//   // Tạo đối tượng lưu trữ với dữ liệu
//   const item: LocalStorageItem<T> = {
//     data: value,
//   };

//   // Nếu cần hash dữ liệu (hashed = true)
//   if (hashed) {
//     // Tạo đối tượng hash dựa trên dữ liệu và userAgent của trình duyệt
//     const hashObject: Hash<T> = {
//       data: value,
//       userAgent: navigator.userAgent,
//     };

//     // Tính toán giá trị hash và gán vào thuộc tính hash
//     item.hash = hash(hashObject);
//   }

//   // Chuyển đối tượng thành chuỗi JSON và lưu vào localStorage
//   localStorage.setItem(key, JSON.stringify(item));
// }

// // Hàm xóa mục khỏi localStorage
// export function removeItem(key: string) {
//   // Xoá mục theo key
//   localStorage.removeItem(key);
// }
