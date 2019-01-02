const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const correctPassWord =
        user !== null && await bcrypt.compare(body.password, user.passwordHash)

    if (!correctPassWord)
        return response.status(401).send({ error: 'Invalid username or password' })

    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)

    response.json({ token, username: user.username, name: user.name })
})


const getUserFromToken = async (request) => {
    try {
        const token = request.token
        const decoded = jwt.verify(token, process.env.SECRET)
        if (token && decoded.id) {
            return await User.findById(decoded.id)
        }
    } catch (error) {null}
    return null
}

module.exports = {
    loginRouter,
    getUserFromToken
}