const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { loginRouter } = require('./controllers/login')

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.error)

//Connect to MongoDB
mongoose
    .set('useFindAndModify', false)
    .connect(config.mongoUrl, { useNewUrlParser: true } )
    .then(console.log('Connected to database'))
    .catch(err => console.err(err.message))


const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => mongoose.connection.close())

module.exports = {
    app,
    server
}