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

blogsRouter.put('/:id', async (request, response) => {
    try {
        const updatedBLog = await Blog
            .findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
        response.json(updatedBLog)
    } catch (error) {
        response.status(400).send({ error: 'Update was unsuccesfull' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {

    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        response.status(204).end()
    }
})

module.exports = blogsRouter
