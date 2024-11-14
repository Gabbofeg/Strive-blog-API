const mongoose = require('mongoose')


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String ,
        required: true

    },
    email: {
        type: String ,
        required: true

    }, 
    birthday: {
        type: String,
        required: true

    },
    avatar: {
        type: String,
        required: true,
        default: "https://picsum.photos/100/100"
    }
}, { timestamps: true , strict: true })

module.exports = mongoose.model('author', authorSchema, 'author') 