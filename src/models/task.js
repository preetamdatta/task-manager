const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Completed: {
        type: Boolean,
        default: false
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('task', taskSchema)

module.exports = Task