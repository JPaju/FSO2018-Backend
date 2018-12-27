const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json',(req, res) => JSON.stringify(req['body']))
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))


app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(n => n.id === id)
  note ?
    res.json(note) :
    res.status(404).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content)
    return response.status(400).json({ error: 'content is required' })

  const note = {
    id: generateId(),
    content: body.content,
    date: new Date(),
    important: body.important || false
<<<<<<< HEAD
=======
  })

  note
    .save()
    .then(savedNote => {
      response.json(formatNote(savedNote))
    })
})


app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
>>>>>>> 8fc6c26... Added comments
  }

  notes = notes.concat(note)
  response.json(body)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

//Formats note to from database format to frontend
const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id
  delete formattedNote.__v
  return formattedNote
}

//Start application on Heroku-binded port or port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})