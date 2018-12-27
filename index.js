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
  Note
    .findById(req.params.id)
    .then(formatNote)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      res.status(400).send({error: 'invalid id-format'})
    })
})


app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content)
    return response.status(400).json({ error: 'content is required' })

  const note = new Note({
    id: generateId(),
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note
    .save()
    .then(formatNote)
    .then(savedNote => response.json(savedNote))
})


app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note
    .findOneAndUpdate({ _id: request.params.id }, note, { new: true } )
    .then(formatNote)
    .then(updatedNote => response.json(updatedNote))
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


app.delete('/api/notes/:id', (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(400).send({error: 'invalid id-format'})
    })
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