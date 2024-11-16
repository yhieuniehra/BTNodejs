const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const Task = require('./models/task');

const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/task_manager')
    .then(() => console.log('Đã kết nối tới MongoDB'))
    .catch(err => console.log(err));

// Cấu hình
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Phân tích cú pháp dữ liệu JSON từ body

// Đường dẫn GET để lấy danh sách công việc
app.get('/', async (req, res) => {
    let query = {};
    if (req.query.title) {
        query.title = { $regex: req.query.title, $options: 'i' }; // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa/thường)
    }
    if (req.query.status && req.query.status !== 'all') {
        query.status = req.query.status; // Lọc theo trạng thái
    }

    try {
        let tasks = await Task.find(query); // Tìm công việc dựa trên query
        res.render('index', { tasks }); // Render ra trang 'index.ejs'
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching tasks'); // Phản hồi lỗi
    }
});

// Route để lấy thông tin công việc cần chỉnh sửa
app.get('/tasks/:id/edit', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        res.render('edit', { task }); // Hiển thị trang edit.ejs với dữ liệu công việc
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading task for editing');
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate,
            points: req.body.points
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating task');
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting task');
    }
});

// Đường dẫn POST để thêm công việc mới
app.post('/tasks', async (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'New', // Đặt trạng thái mặc định là 'New' nếu không có
        dueDate: req.body.dueDate,
        points: req.body.points || 0 // Đặt điểm mặc định là 0 nếu không có
    });

    try {
        await newTask.save(); // Lưu công việc mới vào MongoDB
        res.redirect('/'); // Chuyển hướng về trang chủ sau khi thêm
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding task'); // Phản hồi lỗi nếu có
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên cổng ${PORT}`);
});
