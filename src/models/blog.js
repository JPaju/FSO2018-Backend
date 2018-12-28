const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    author: String,
    url: {
        type: String,
        unique: true
    },
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog