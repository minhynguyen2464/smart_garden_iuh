<h1>Smart Garden Project</h1>

<p>Dự án <strong>Smart Garden</strong> giúp tự động hóa và giám sát các hoạt động trong vườn bằng cách sử dụng cảm biến, mô hình máy học và Firebase để lưu trữ dữ liệu và tương tác theo thời gian thực. Hệ thống có thể thực hiện các hành động như tưới cây, giám sát độ ẩm đất, dự đoán tình trạng sức khỏe của cây trồng và quản lý tất cả dữ liệu thông qua backend Node.js tích hợp Firebase.</p>

<h2>Tính năng</h2>
<ul>
  <li><strong>Tự động điều khiển vườn:</strong> Tự động tưới cây dựa trên dữ liệu cảm biến (ví dụ như độ ẩm đất, độ ẩm không khí).</li>
  <li><strong>Tích hợp máy học:</strong> Sử dụng ONNXRuntime để chạy các mô hình máy học nhằm dự đoán sức khỏe của cây trồng hoặc tối ưu hóa lịch trình tưới tiêu.</li>
  <li><strong>Tích hợp Firebase:</strong> Firebase được sử dụng để lưu trữ dữ liệu thời gian thực, quản lý xác thực người dùng và đồng bộ hóa dữ liệu giữa vườn và đám mây.</li>
  <li><strong>Tải lên tệp:</strong> Cho phép người dùng tải lên dữ liệu cảm biến hoặc hình ảnh liên quan đến sức khỏe cây trồng để phân tích thêm.</li>
  <li><strong>Lịch trình tự động:</strong> Thực hiện các tác vụ tự động như thu thập dữ liệu hoặc tưới tiêu bằng cách sử dụng <code>node-cron</code>.</li>
  <li><strong>Giám sát thời gian thực:</strong> Cung cấp các bản cập nhật thời gian thực và thông báo dựa trên điều kiện của vườn.</li>
</ul>

<h2>Yêu cầu</h2>
<p>Trước khi chạy dự án, hãy đảm bảo bạn đã cài đặt:</p>
<ul>
  <li><a href="https://nodejs.org/">Node.js</a> (phiên bản 14.x hoặc mới hơn)</li>
  <li>Dự án Firebase với các thông tin xác thực hợp lệ</li>
  <li>Mô hình ONNXRuntime (nếu sử dụng các tính năng máy học)</li>
</ul>

<h2>Cài đặt</h2>
<ol>
  <li><strong>Clone repository:</strong>
    <pre><code>git clone &lt;repository_url&gt;
cd smart-garden</code></pre>
  </li>

  <li><strong>Cài đặt các thư viện phụ thuộc:</strong>
    <pre><code>npm install</code></pre>
  </li>

  <li><strong>Cấu hình Firebase:</strong>
    <p>Tạo một dự án Firebase mới. Tạo một khoá <code>firebase-adminsdk</code> riêng tư cho server. Thêm thông tin cấu hình Firebase vào dự án của bạn.</p>
  </li>

  <li><strong>Cấu hình biến môi trường:</strong>
    <p>Tạo tệp <code>.env</code> trong thư mục gốc với thông tin sau:</p>
    <pre><code>FIREBASE_API_KEY=&lt;your-firebase-api-key&gt;
FIREBASE_AUTH_DOMAIN=&lt;your-auth-domain&gt;
FIREBASE_PROJECT_ID=&lt;your-project-id&gt;
FIREBASE_STORAGE_BUCKET=&lt;your-storage-bucket&gt;
FIREBASE_MESSAGING_SENDER_ID=&lt;your-messaging-sender-id&gt;
FIREBASE_APP_ID=&lt;your-app-id&gt;
</code></pre>
  </li>

  <li><strong>Khởi động server:</strong>
    <pre><code>npm start</code></pre>
    <p>Lệnh này sẽ chạy server bằng <strong>Nodemon</strong>, tự động khởi động lại server khi có thay đổi trong mã nguồn.</p>
  </li>
</ol>

<h2>Sử dụng</h2>
<p><strong>Chạy server:</strong> Khi server đã chạy, API sẽ khả dụng tại <code>http://localhost:3000</code> (hoặc bất kỳ cổng nào bạn đã cấu hình).</p>
<p><strong>Tải lên dữ liệu:</strong> Sử dụng endpoint <code>/upload</code> để tải lên dữ liệu cảm biến hoặc hình ảnh để phân tích.</p>
<p><strong>Giám sát vườn:</strong> Hệ thống sẽ tự động giám sát và lập lịch các hành động như tưới nước dựa trên dữ liệu hiện tại từ các cảm biến.</p>

<h3>Ví dụ về các yêu cầu API</h3>
<ul>
  <li><strong>POST</strong> <code>/upload</code> – Tải lên tệp hình ảnh hoặc dữ liệu cảm biến.</li>
  <li><strong>GET</strong> <code>/status</code> – Lấy trạng thái hiện tại của vườn (độ ẩm đất, độ ẩm không khí, v.v.).</li>
</ul>

<h2>Phụ thuộc chính</h2>
<ul>
  <li><strong>Express:</strong> Framework web để xử lý các yêu cầu API.</li>
  <li><strong>Firebase:</strong> Dùng cho xác thực và quản lý cơ sở dữ liệu thời gian thực.</li>
  <li><strong>ONNXRuntime:</strong> Để chạy các mô hình máy học trên backend.</li>
  <li><strong>Multer:</strong> Xử lý tải lên tệp cho dữ liệu cảm biến hoặc hình ảnh.</li>
  <li><strong>node-cron:</strong> Lên lịch các tác vụ tự động để điều khiển vườn.</li>
</ul>

<h2>Phát triển</h2>
<p>Trong quá trình phát triển, bạn có thể chạy lệnh sau:</p>
<pre><code>npm run dev</code></pre>
<p>Lệnh này sẽ khởi động server ở chế độ phát triển với <strong>Nodemon</strong>, tự động tải lại server khi có thay đổi trong mã nguồn.</p>

<h2>Bản quyền</h2>
<p>Dự án này được cấp phép theo giấy phép MIT. Xem tệp <code>LICENSE</code> để biết thêm chi tiết.</p>
