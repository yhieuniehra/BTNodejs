const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Sử dụng bodyParser để xử lý dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  // Thêm express.json() để xử lý JSON nếu cần

// Sử dụng thư mục 'public' để lưu các file tĩnh như index.html
app.use(express.static(path.join(__dirname, 'public')));

// Route để lấy danh sách các tỉnh
app.get('/api/provinces', (req, res) => {
  fs.readFile('vehicle_plates.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Lỗi server!');
    }
    const provinces = JSON.parse(data);
    res.json(Object.keys(provinces));  // Trả về danh sách tên các tỉnh
  });
});

// Route để lấy biển số theo tỉnh
app.post('/api/plate', (req, res) => {
  const selectedProvince = req.body.province;

  fs.readFile('vehicle_plates.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Lỗi server!');
    }
    const plates = JSON.parse(data);
    const plateNumber = plates[selectedProvince];

    if (plateNumber) {
      res.json({ plate: plateNumber });
    } else {
      res.status(404).send('Tỉnh không tồn tại');
    }
  });
});

// Lắng nghe trên cổng được chỉ định
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
