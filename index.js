const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


let notes = [
  {
    id: 1,
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z',
    important: true
  }
]



app.get('/notes', (req, res) => {
  res.json(notes)
})

app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(n => n.id === id)
  note ?
    res.json(note) :
    res.status(404).end()
})

app.post('/notes', (request, response) => {
  const body = request.body
  if (!body.content)
    return response.status(400).json({ error: 'content is required' })

  const note = {
    id: generateId(),
    content: body.content,
    date: new Date(),
    important: body.important || false
  }

  notes = notes.concat(note)
  response.json(body)
})

const generateId = () => notes.length > 0 ? notes.map(n => n.id).sort((a, b) => a - b).reverse()[0] + 1 : 1

app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})