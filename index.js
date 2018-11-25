const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


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
  response.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const contact = contacts.find(c => c.id === id)
  contact ?
    res.json(contact) :
    res.status(404).end()
})

app.get('/info', (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.write(`<div>Puhelinluettelossa on ${contacts.length} yhteystietoa </div>`)
  response.end("<div>" + new Date().toString() + "</div>")
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const contact = {
    name: body.name,
    nummber: body.number,
    id: generateId(),
  }

  contacts = contacts.concat(contact)
  response.json(body)
})

const generateId = () => Math.floor(Math.random() * 10000)

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(c => c.id !== id)
  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})