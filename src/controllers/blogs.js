const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { validToken } = require('./login')


blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', { name: 1, username: 1 })
        .then(response => response.map(Blog.format))
        .then(blogs => response.json(blogs))
})

blogsRouter.post('/', async (request, response) => {


    if (!validToken(request)) {
        return response.status(401).send({ error: 'Invalid token' })
    }

    if (!request.body.title || !request.body.author || !request.body.url) {
        return response.status(400).json({ error: 'Author and url are required' })
    }

    try {
        const user = await User.findOne({})

        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user._id
        })
        await blog.save()

        //Add new blog to user
        user.blogs = user.blogs.concat(blog._id)
        await user.save()

        response.status(201).json(Blog.format(blog))
    } catch (error) {
        console.log(error)
        response.status(400)
        if (error.code === 11000)
            response.send({ error: 'title and url needs to be unique!' })
        else
            response.send({ error: 'ilformatted request' })
    }
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
