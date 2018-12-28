const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Contact = require('./modules/contact')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', (req) => JSON.stringify(req['body']))
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))


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
        .catch(() => response.status(400).send({ error: 'invalid id-format' }))
})


app.get('/info', (request, response) => {
    Contact
        .find({})
        .then(contacts => {
            response.write(`<div>Puhelinluettelossa on ${contacts.length} yhteystietoa </div>`)
            response.end('<div>' + new Date().toString() + '</div>')
        })
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number || !body.name)
        return response.status(400).json({ error: 'name and number is required' })

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact
        .save()
        .then(Contact.format)
        .then(contact => response.json(contact))
        .catch(err => {
            if (err.code === 11000 && err.name === 'MongoError') {
                response.status(400).send({ error: 'name must be unique' })
            }
        })
})

app.put('/api/persons/:id', (request, response) => {

    const contact = {
        name: request.body.name,
        number: request.body.number
    }

    Contact
        .findOneAndUpdate({ _id: request.params.id }, contact, { new: true })
        .then(Contact.format)
        .then(contact => response.json(contact))
        .catch(() => response.status(400).send({ error: 'malformatted id' }))
})


app.delete('/api/persons/:id', (request, response) => {
    Contact
        .findByIdAndRemove(request.params.id)
        .then(response.status(204).end())
        .catch(err => console.error('ERROR:', err.message))
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})