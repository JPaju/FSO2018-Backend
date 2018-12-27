const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Contact = require('./modules/contact')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json',(req, res) => JSON.stringify(req['body']))
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))

let contacts = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]


app.get('/api/persons', (request, response) => {
  Contact
    .find({})
    .then(contacts => contacts.map(Contact.format))
    .then(formattedContacts => {
      response.json(formattedContacts)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Contact
    .findById(request.params.id)
    .then(Contact.format)
    .then(contact => {
      if (contact) response.json(contact)
      else response.status(404).end()
    })
    .catch(err => {
      response.status(400).send({error: 'invalid id-format'})
    })
})

app.get('/info', (request, response) => {
  Contact
    .find({})
    .then(contacts => {
      response.write(`<div>Puhelinluettelossa on ${contacts.length} yhteystietoa </div>`)
      response.end("<div>" + new Date().toString() + "</div>")
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.number || !body.name)
    return response.status(400).json({ error: 'name and number is required' })
  if (contacts.some(c => c.name === body.name))
    return response.status(400).json({ error: 'name must be unique' })
    
  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  contacts = contacts.concat(contact)
  response.json(body)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(c => c.id !== id)
  response.status(204).end()
})


const generateId = () => Math.floor(Math.random() * 10000)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})