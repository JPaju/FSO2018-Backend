const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', (request, response) => {
    User
        .find({})
        .then(users => users.map(User.format))
        .then(formattedUsers => response.json(formattedUsers))
        .catch(() => response.status(500).send({ error: 'something bad happened' }))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.name || !body.password || !body.username)
        return response.status(400).send({ error: 'Name, username and password are required!' })

    const hash = await bcrypt.hash(body.password, 10)

    try {
        const user = new User({
            name: body.name,
            username: body.username,
            passwordHash: hash,
            adult: body.adult || false
        })

        const createdUser = await user.save()
        response.json(createdUser)

    } catch (error) {
        if (error.code === 11000)
            response.status(400).send({ error: 'Username must be unique' })
        else
            response.status(400).send({ error: 'Creating user failed' })

    }

})

module.exports = usersRouter
