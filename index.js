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

app.get('/info', (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.write(`<div>Puhelinluettelossa on ${contacts.length} yhteystietoa </div>`)
  response.end("<div>" + new Date().toString() + "</div>")
})

const generateId = () => contacts.length > 0 ? contacts.map(c => c.id).sort((a, b) => a - b).reverse()[0] + 1 : 1


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})