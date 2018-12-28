const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger())

app.use('/api/blogs', blogsRouter)

app.use(middleware.error)

//Connect to MongoDB
if ( process.env.NODE_ENV !== 'production' ) require('dotenv').config()
mongoose
    .connect(process.env.MONGODB_BLOGS_URL, { useNewUrlParser: true } )
    .then(console.log('Connected to database'))
    .catch(err => console.err(err.message))


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
