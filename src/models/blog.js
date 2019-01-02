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
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.statics.format = function(blog) {
    const formattedBlog = { ...blog._doc, id: blog._id }
    delete formattedBlog._id
    delete formattedBlog.__v
    return formattedBlog
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog