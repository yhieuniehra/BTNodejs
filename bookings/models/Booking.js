const mongoose = require('mongoose');

// Định nghĩa schema cho lịch đặt chỗ
const bookingSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
});


  
// Tạo model từ schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
