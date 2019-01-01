const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(response => response.map(Blog.format))
        .then(blogs => response.json(blogs))
})

blogsRouter.post('/', (request, response) => {

    let body = request.body

    if (!body.title || !body.author || !body.url) {
        return response.status(400).json({ error: 'Author and url are required' })
    }

    if (!body.likes) body.likes = 0

    const blog = new Blog(body)

    blog
        .save()
        .then(blog.format)
        .then(blog => response.status(201).json(Blog.format(blog)))
        .catch(err => {
            response.status(400)
            if (err.code === 11000)
                response.send({ error: 'title and url needs to be unique!' })
            else
                response.send({ error: 'ilformatted request' })
        })
})

module.exports = blogsRouter
