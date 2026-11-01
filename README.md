# EduRent – Mượn và cho thuê đồ sinh viên

EduRent là website giúp sinh viên mượn đồ của nhau trong khuôn viên trường (máy ảnh, máy tính cầm tay, bàn phím, micro...). Người mượn bỏ nhiều món vào túi đồ rồi thanh toán một lượt qua VietQR, ngân hàng (ATM/Napas), thẻ Visa/Mastercard hoặc PayPal (môi trường thử nghiệm mô phỏng).

Dự án gồm hai phần chạy song song:

| Phần | Công nghệ | Cổng | Nhiệm vụ |
|---|---|---|---|
| `frontend/` | Next.js 16, React 19, Tailwind CSS 4 | 3000 | Giao diện web, chạy được trên máy tính và điện thoại |
| `backend/` | Node.js, Express 4 | 4000 | API (giao diện lập trình): đăng nhập, phân quyền, sản phẩm, ảnh, đơn hàng, mã VietQR |

Trình duyệt chỉ làm việc với cổng 3000. Mọi yêu cầu `/api/...` và `/uploads/...` được Next.js chuyển tiếp sang backend ở cổng 4000, nên không cần cấu hình CORS (chia sẻ tài nguyên giữa hai địa chỉ khác nhau).

---

## 1. Vai trò và quyền hạn

Mở web lên sẽ vào ngay trang đăng nhập. Sau khi đăng nhập, giao diện thay đổi theo vai trò của tài khoản.

| Vai trò | Thấy gì | Làm được gì |
|---|---|---|
| **Người mượn** | Toàn bộ đồ đang cho thuê, túi đồ và đơn của chính mình | Thêm đồ vào túi, chỉnh số ngày từng món, thanh toán một lượt. Thông tin người mượn được tự điền theo tài khoản |
| **Người cho thuê** | Chỉ sản phẩm của chính mình, và chỉ phần đơn hàng có đồ của mình | Thêm, sửa, xóa sản phẩm của mình, tải lên hoặc xóa ảnh, chọn ảnh đại diện |
| **Quản trị (admin)** | Tất cả sản phẩm, tất cả đơn hàng, tất cả tài khoản | Thêm, sửa, xóa mọi sản phẩm và chọn sản phẩm thuộc người cho thuê nào |

Quyền được kiểm tra ở **backend**, không chỉ ẩn nút trên giao diện. Ví dụ người cho thuê gọi API xóa sản phẩm của người khác sẽ nhận lỗi 403 (không có quyền).

Người dùng tự tạo tài khoản được chọn vai trò **người mượn** hoặc **người cho thuê**. Tài khoản admin chỉ có trong dữ liệu mẫu.

### Tài khoản demo

| Tên đăng nhập | Mật khẩu | Vai trò |
|---|---|---|
| `admin` | `admin123` | Quản trị |
| `chothue01` | `123456` | Người cho thuê (Lê Minh) |
| `chothue02` | `123456` | Người cho thuê (Hoàng Anh) |
| `sv01` | `123456` | Người mượn (Nguyễn Văn An) |

Trên trang đăng nhập có sẵn nút bấm để điền nhanh các tài khoản này.

---

## 2. Cài đặt và chạy

### Yêu cầu

- **Node.js** bản 20.9 trở lên, khuyên dùng bản LTS mới nhất tại nodejs.org. Gõ `node -v` để kiểm tra.
- Trên Windows nên cài thêm **Microsoft Visual C++ Redistributable (x64)**, vì Next.js cần nó để chạy.

### Các bước

Mở terminal (PowerShell hoặc terminal trong VS Code) **tại thư mục gốc của dự án**, tức thư mục chứa file README này, rồi gõ lần lượt:

```bash
npm install
```

Lệnh này cài thư viện cho cả ba nơi: thư mục gốc, `backend/` và `frontend/`. Lần đầu mất vài phút.

```bash
npm run dev
```

Lệnh này bật cùng lúc backend (cổng 4000) và frontend (cổng 3000). Trong terminal, dòng bắt đầu bằng `[api]` là của backend, dòng bắt đầu bằng `[web]` là của frontend.

Khi thấy `[api] EduRent API đang chạy...` và `[web] ✓ Ready`, mở trình duyệt vào **http://localhost:3000**.

Muốn tắt thì bấm `Ctrl + C` trong terminal.

### Xem trên điện thoại

Điện thoại và máy tính phải dùng chung một mạng Wi-Fi. Khi chạy `npm run dev`, dòng `[web]` có in địa chỉ dạng `Network: http://192.168.x.x:3000`. Mở địa chỉ đó trên trình duyệt điện thoại là xem được giao diện điện thoại, có thanh điều hướng ở dưới cùng.

### Các lệnh khác

| Lệnh (chạy ở thư mục gốc) | Tác dụng |
|---|---|
| `npm run dev` | Chạy cả backend và frontend |
| `npm run dev:backend` | Chỉ chạy backend |
| `npm run dev:frontend` | Chỉ chạy frontend |
| `npm run reset-data` | Xóa dữ liệu hiện tại, nạp lại tài khoản và sản phẩm mẫu |

---

## 3. Cấu trúc thư mục

```text
EduRent_FE/
├── package.json              # Lệnh chung: npm install, npm run dev (chạy cả 2 phần)
├── README.md
│
├── backend/                  # API Express, cổng 4000
│   ├── package.json
│   ├── data/db.json          # Cơ sở dữ liệu dạng file JSON (tự tạo khi chạy lần đầu, không đưa lên git)
│   ├── uploads/              # Ảnh sản phẩm được tải lên (không đưa lên git)
│   └── src/
│       ├── server.js         # Khởi động máy chủ, gắn các nhóm API
│       ├── db.js             # Đọc và ghi file db.json
│       ├── seed.js           # Dữ liệu mẫu: tài khoản demo và sản phẩm
│       ├── reset.js          # Nạp lại dữ liệu mẫu (npm run reset-data)
│       ├── auth.js           # Xác thực bằng JWT (mã đăng nhập) và kiểm tra vai trò
│       ├── vietqr.js         # Tạo chuỗi VietQR theo chuẩn Napas 247 và tài khoản nhận tiền
│       └── routes/
│           ├── auth.js       # Đăng nhập, đăng ký, lấy thông tin tài khoản
│           ├── products.js   # Sản phẩm, lọc theo vai trò
│           ├── uploads.js    # Tải ảnh lên
│           ├── orders.js     # Tạo đơn, thanh toán, mã VietQR, lọc đơn theo vai trò
│           └── users.js      # Danh sách tài khoản (chỉ admin)
│
└── frontend/                 # Giao diện Next.js, cổng 3000
    ├── package.json
    ├── next.config.ts        # Chuyển tiếp /api và /uploads sang backend
    └── src/
        ├── app/
        │   ├── layout.tsx            # Khung chung, nạp trạng thái đăng nhập và túi đồ
        │   ├── globals.css
        │   ├── login/page.tsx        # Đăng nhập và tạo tài khoản
        │   └── (main)/               # Nhóm trang bắt buộc đăng nhập
        │       ├── layout.tsx        # Chưa đăng nhập thì chuyển về /login
        │       ├── page.tsx          # Trang chính: người mượn xem đồ, người cho thuê và admin quản lý sản phẩm
        │       ├── cart/             # Túi đồ (người mượn)
        │       ├── checkout/         # Thanh toán và trang thành công (người mượn)
        │       ├── orders/           # Đơn hàng, lọc theo vai trò
        │       └── users/            # Danh sách tài khoản (admin)
        ├── components/
        │   ├── AppShell.tsx          # Thanh trên cùng và thanh điều hướng dưới cùng trên điện thoại
        │   ├── AuthGate.tsx          # Chặn trang khi chưa đăng nhập
        │   ├── LoginForm.tsx
        │   ├── Catalog.tsx           # Danh sách đồ cho người mượn
        │   ├── CartList.tsx          # Các món trong túi đồ và tổng tiền
        │   ├── Receipt.tsx           # Biên nhận sau khi thanh toán
        │   ├── admin/
        │   │   ├── ProductManager.tsx  # Danh sách sản phẩm có nút sửa, xóa
        │   │   └── ProductForm.tsx     # Biểu mẫu sản phẩm, tải ảnh, xóa ảnh, chọn ảnh đại diện
        │   └── checkout/
        │       ├── CheckoutForm.tsx    # Thông tin người mượn và chọn phương thức thanh toán
        │       ├── Modal.tsx           # Khung hộp thoại (dạng trượt từ dưới lên trên điện thoại)
        │       ├── BankQR.tsx          # Vẽ mã QR từ chuỗi VietQR do backend trả về
        │       ├── VietQRModal.tsx
        │       ├── AtmPaymentModal.tsx # Ngân hàng: chọn quét mã QR hoặc nhập thẻ ATM và OTP
        │       ├── CardPaymentModal.tsx
        │       └── PayPalModal.tsx     # Mô phỏng luồng PayPal: tạo đơn, khách duyệt, chốt thu tiền
        ├── lib/
        │   ├── api.ts        # Hàm gọi backend, tự gắn mã đăng nhập
        │   ├── auth.tsx      # Trạng thái đăng nhập
        │   ├── cart.tsx      # Túi đồ, lưu riêng cho từng tài khoản trên trình duyệt
        │   ├── types.ts      # Kiểu dữ liệu dùng chung
        │   └── format.ts     # Định dạng tiền VND và quy đổi USD
        └── types/payment.ts  # Phương thức thanh toán
```

---

## 4. Danh sách API

Mọi API trừ đăng nhập và đăng ký đều cần tiêu đề `Authorization: Bearer <mã đăng nhập>`.

| Phương thức | Đường dẫn | Ai được gọi | Chức năng |
|---|---|---|---|
| POST | `/api/auth/login` | Mọi người | Đăng nhập, trả về mã đăng nhập và thông tin tài khoản |
| POST | `/api/auth/register` | Mọi người | Tạo tài khoản người mượn hoặc người cho thuê |
| GET | `/api/auth/me` | Đã đăng nhập | Thông tin tài khoản hiện tại |
| GET | `/api/products` | Đã đăng nhập | Người cho thuê chỉ nhận sản phẩm của mình, các vai trò khác nhận tất cả |
| POST | `/api/products` | Người cho thuê, admin | Thêm sản phẩm |
| PUT | `/api/products/:id` | Chủ sản phẩm, admin | Sửa sản phẩm |
| DELETE | `/api/products/:id` | Chủ sản phẩm, admin | Xóa sản phẩm |
| POST | `/api/uploads` | Người cho thuê, admin | Tải ảnh lên (tối đa 10 ảnh, mỗi ảnh 5MB), trả về đường dẫn ảnh |
| GET | `/api/orders` | Đã đăng nhập | Người mượn: đơn của mình. Người cho thuê: phần đơn có đồ của mình. Admin: tất cả |
| POST | `/api/orders` | Người mượn | Tạo đơn "Chờ thanh toán". Backend tự tính lại tổng tiền từ giá trong cơ sở dữ liệu |
| GET | `/api/orders/:id/vietqr` | Người mượn (chủ đơn) | Chuỗi VietQR để vẽ mã QR chuyển khoản |
| POST | `/api/orders/:id/pay` | Người mượn (chủ đơn) | Đánh dấu đã thanh toán. Gọi nhiều lần vẫn cho cùng kết quả |
| GET | `/api/users` | Admin | Danh sách tài khoản |

---

## 5. Cấu hình tài khoản nhận tiền VietQR

Mã QR trong phần VietQR và phần Ngân hàng được tạo theo chuẩn VietQR thật, nên app ngân hàng nào cũng quét được và tự điền số tiền cùng nội dung chuyển khoản. Tài khoản nhận mặc định là `0000000000` để an toàn khi demo.

Muốn dùng tài khoản thật của nhóm, mở `backend/src/vietqr.js` và sửa phần `RECEIVER`:

```js
bankBin: '970422',          // mã ngân hàng theo Napas, ví dụ MB Bank là 970422
bankName: 'MB Bank',
accountNo: '0000000000',    // số tài khoản nhận tiền
accountName: 'EDURENT DEMO' // tên chủ tài khoản, viết hoa không dấu
```

Mã của một số ngân hàng: Vietcombank `970436`, Techcombank `970407`, MB Bank `970422`, BIDV `970418`, ACB `970416`, VPBank `970432`.

---

## 6. Lưu ý về phạm vi demo

- Thanh toán là **mô phỏng**, không có tiền thật được chuyển. Thông tin thẻ nhập vào không được gửi đi đâu cả.
- Khi bấm "Tôi đã chuyển khoản", đơn được đánh dấu đã thanh toán ngay. Bản thật phải chờ ngân hàng hoặc cổng thanh toán gửi thông báo tự động (webhook) về backend và xác minh chữ ký trước khi đổi trạng thái đơn.
- PayPal không nhận VND nên số tiền được quy đổi sang USD theo tỷ giá tham khảo 26.300 đ/USD.
- Dữ liệu lưu trong file `backend/data/db.json`. Muốn chuyển sang MySQL hoặc MongoDB thì chỉ cần thay các hàm trong `backend/src/db.js`.
- Mật khẩu được băm bằng bcrypt. Khóa ký mã đăng nhập (`JWT_SECRET`) đang để mặc định cho môi trường thử nghiệm, khi đưa lên mạng thật phải đặt lại bằng biến môi trường.

---

## 7. Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `'npm' is not recognized` | Chưa cài Node.js. Cài bản LTS rồi đóng và mở lại terminal |
| `Could not read package.json` | Đang đứng sai thư mục. Dùng `cd` vào thư mục chứa README này |
| `'next' is not recognized` hoặc `'concurrently' is not recognized` | Chưa cài thư viện. Chạy `npm install` ở thư mục gốc |
| `running scripts is disabled on this system` | Gõ `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` một lần |
| `next-swc... is not a valid Win32 application` hoặc `Turbopack is not supported` | File của Next.js tải về bị hỏng. Xóa thư mục `frontend/node_modules`, chạy `npm cache clean --force`, cài Visual C++ Redistributable (x64), rồi chạy lại `npm install` |
| `EADDRINUSE: address already in use :::4000` (hoặc `:3000`) | Đang có một bản khác chạy. Tắt terminal cũ hoặc khởi động lại máy |
| Giao diện báo "Không kết nối được máy chủ" | Backend chưa chạy. Kiểm tra trong terminal có dòng `[api] EduRent API đang chạy` |
