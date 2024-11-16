const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Sử dụng body-parser để xử lý dữ liệu POST từ form
app.use(bodyParser.urlencoded({ extended: true }));

// Hiển thị form login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Xử lý request login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Đọc file user.txt để kiểm tra thông tin đăng nhập
  fs.readFile('user.txt', 'utf8', (err, data) => {
    if (err) {
      return res.send('Lỗi server, vui lòng thử lại sau.');
    }

    // Tìm thông tin tài khoản trong file user.txt
    const users = data.split('\n').map(user => user.trim());
    const validUser = users.find(user => {
      const [savedUsername, savedPassword] = user.split(',');
      return savedUsername === username && savedPassword === password;
    });

    // Nếu thông tin khớp, hiển thị thông tin user, nếu không báo lỗi
    if (validUser) {
      res.send(`Đăng nhập thành công! Chào mừng ${username}.`);
    } else {
      res.send('Đăng nhập thất bại! Sai username hoặc password.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
