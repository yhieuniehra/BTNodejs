// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type:String, required:true},
    description: String,
    status: { type: String, enum: ['New', 'Pending', 'Done'], default: 'New' },
    dueDate: { type: Date, default: Date.now },
    points: Number
});

module.exports = mongoose.model('task', taskSchema);

