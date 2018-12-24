const mongoose = require('mongoose')

const url = 'mongodb://usr:passwd@ds123372.mlab.com:23372/fso-notes'

mongoose.connect(url ,{useNewUrlParser: true})

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

const note = new Note({
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: new Date(),
    important: true
})

Note
    .find({important: true})
    .then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })

/*
note
    .save()
    .then(response => {
        console.log(`note: ${note} was saved!`)
        mongoose.connection.close()
    })
*/