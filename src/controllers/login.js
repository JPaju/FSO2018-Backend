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


const getToken = (request) => {
    const auth = request.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

const validToken = (request) => {
    try {
        const token = getToken(request)
        const decoded = jwt.verify(token, process.env.SECRET)
        return (token && decoded.id)
    } catch (error) {
        return false
    }
}

module.exports = {
    loginRouter,
    getToken,
    validToken
}