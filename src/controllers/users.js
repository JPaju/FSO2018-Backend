const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', (request, response) => {
    User
        .find({})
        .populate('blogs', { title: 1, author: 1, url: 1, likes: 1, _id: 1 })
        .then(users => response.json(users.map(User.format)))
        .catch(() => response.status(500).send({ error: 'something bad happened' }))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    let hash

    if (body.password && body.password.length > 3)
        hash = await bcrypt.hash(body.password, 10)
    else
        return response.status(400).send({ error: 'Password length must be over 3 characters' })


    try {
        const user = new User({
            name: body.name,
            username: body.username,
            passwordHash: hash,
            adult: body.adult
        })

        const createdUser = await user.save()
        response.status(201).json(User.format(createdUser))

    } catch (error) {
        if (error.code === 11000)
            response.status(400).send({ error: 'Username must be unique' })
        else if (error.name === 'ValidationError')
            response.status(400).send({ error: 'Name, username and password are required' })
        else
            response.status(400).send({ error: 'Creating user failed' })

    }

})

module.exports = usersRouter
