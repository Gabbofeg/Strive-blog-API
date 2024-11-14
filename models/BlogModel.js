const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    category: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
        default: 'https://picsum.photos/100/100'
    },
    readTime: {
        value: {
            type: Number,
            required: false
        },
        unit: {
            type: String,
            default: 'minutes'
        }
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'author'
    }, 
    content: {
        type: String,
        required: true,
    },
}, 
{ timestamps: true, strict: true}
)

module.exports = mongoose.model('postModel', blogSchema, 'post')