const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

//Connect to database
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
mongoose
    .connect(process.env.MONGODB_NOTES_URL, { useNewUrlParser: true })
    .then(() => console.log('Connected to database', process.env.MONGODB_NOTES_URL))
    .catch(err => console.log(err.message))

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger())

app.use('/api/notes', notesRouter)

app.use(middleware.error)


//Start application on Heroku-binded port or port 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})