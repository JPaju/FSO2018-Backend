const notesRouter = require('express').Router()
const Note = require('../models/note')

const formatNote = (note) => {
    return {
        id: note._id,
        content: note.content,
        date: note.date,
        important: note.important
    }
}

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({})
    res.json(notes.map(formatNote))
})

notesRouter.get('/:id', (req, res) => {
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
        .catch(() => {
            res.status(400).send({ error: 'invalid id-format' })
        })
})


notesRouter.post('/', (request, response) => {
    const body = request.body

    if (!body.content)
        return response.status(400).json({ error: 'content is required' })

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false
    })

    note
        .save()
        .then(formatNote)
        .then(savedNote => response.json(savedNote))
})


notesRouter.put('/:id', (request, response) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note
        .findOneAndUpdate({ _id: request.params.id }, note, { new: true })
        .then(formatNote)
        .then(updatedNote => response.json(updatedNote))
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})


notesRouter.delete('/:id', (req, res) => {
    Note
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(() => {
            res.status(400).send({ error: 'invalid id-format' })
        })
})

module.exports = notesRouter
