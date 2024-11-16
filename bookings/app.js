const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Booking = require('./models/Booking');
const app = express();
const path = require('path');

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/booking-system')
  .then(() => console.log('Kết nối thành công tới MongoDB!'))
  .catch((err) => console.log('Lỗi kết nối MongoDB:', err));


// Cấu hình middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Trang danh sách lịch đặt chỗ
app.get('/bookings', async (req, res) => {
  const bookings = await Booking.find();
  res.render('bookings', { bookings });
});

app.get('/', (req, res) => {
    res.send('Trang chủ của hệ thống quản lý lịch đặt chỗ');
  });
  

// Trang thêm lịch đặt chỗ mới
app.get('/bookings/new', (req, res) => {
  res.render('newBooking');
});

app.post('/bookings', async (req, res) => {
  const { customerName, date, time } = req.body;
  try {
    // Kiểm tra nếu đã tồn tại lịch cùng ngày và giờ
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.send('Lịch đặt đã tồn tại cho thời gian này. Vui lòng chọn thời gian khác.');
    }
    const newBooking = new Booking({ customerName, date, time });
    await newBooking.save();
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).send('Đã xảy ra lỗi khi thêm lịch đặt chỗ.');
  }
});

// Trang chỉnh sửa lịch đặt chỗ
app.get('/bookings/edit/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  res.render('editBooking', { booking });
});

app.post('/bookings/edit/:id', async (req, res) => {
  const { customerName, date, time } = req.body;
  try {
    await Booking.findByIdAndUpdate(req.params.id, { customerName, date, time });
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).send('Đã xảy ra lỗi khi cập nhật lịch đặt chỗ.');
  }
});
 //hủy lịch
app.get('/bookings/cancel/:id', async (req, res) => {
    try {
      console.log("ID cần hủy:", req.params.id);
      await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
      res.redirect('/bookings');
    } catch (err) {
      console.error("Lỗi khi hủy lịch đặt chỗ:", err);
      res.status(500).send('Đã xảy ra lỗi khi hủy lịch đặt chỗ.');
    }
  });
  



// Chạy server
app.listen(3000, () => {
  console.log('Server đang chạy tại http://localhost:3000');
});
